# main.py
import openai
import psycopg2
import uuid
import sys
from datetime import datetime
import logging
import yaml
import os 
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("embedding_process.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("embed-chunks")

# Load the YAML file
logger.info("Loading chunks from chunks.yaml file")
try:
    with open("chunks.yaml", "r", encoding="utf-8") as file:
        chunks = yaml.safe_load(file)
    logger.info(f"Successfully loaded {len(chunks)} chunks from YAML file")
except Exception as e:
    logger.error(f"Failed to load chunks: {str(e)}")
    logger.error("Exiting program due to critical error")
    sys.exit(1)  # Exit with error code

# Now chunks is a dictionary where each key corresponds to a chunk.
for key, content in chunks.items():
    logger.debug(f"Chunk {key}:")
    logger.debug(content)
    logger.debug("-" * 40)

# Load environment variables from .env file in the project root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Get the OpenAI API key from environment variables
openai_api_key = os.environ.get('OPENAI_API_KEY')
if not openai_api_key:
    logger.error("OPENAI_API_KEY environment variable not found")
    logger.error("Exiting program due to missing API key")
    sys.exit(1)  # Exit with error code

openai.api_key = openai_api_key
logger.info("OpenAI API key loaded from environment variables")

# Database connection details from environment variables
logger.info("Connecting to database")
try:
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        port=os.environ.get("DB_PORT"),
        dbname=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD")
    )
    cursor = conn.cursor()
    logger.info("Database connection established")
except Exception as e:
    logger.error(f"Database connection failed: {str(e)}")
    logger.error("Exiting program due to database connection failure")
    sys.exit(1)  # Exit with error code

def get_embedding(text: str) -> list:
    """
    Get the embedding for a given text using OpenAI's text-embedding-ada-002 model.
    """
    try:
        logger.debug(f"Getting embedding for text: {text[:50]}...")
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        logger.debug("Embedding received successfully")
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error getting embedding: {str(e)}")
        raise

def insert_resource(content: str) -> str:
    """
    Inserts the provided content into the resources table and returns the generated resource_id.
    """
    resource_id = str(uuid.uuid4())
    now = datetime.now()
    query = """
        INSERT INTO resources (id, content, created_at, updated_at)
        VALUES (%s, %s, %s, %s)
    """
    try:
        logger.debug(f"Inserting resource with ID: {resource_id}")
        cursor.execute(query, (resource_id, content, now, now))
        conn.commit()
        logger.debug("Resource inserted successfully")
        return resource_id
    except Exception as e:
        logger.error(f"Error inserting resource: {str(e)}")
        conn.rollback()
        raise

def insert_embedding(resource_id: str, chunk_content: str, embedding: list):
    """
    Inserts the embedding for a chunk into the embeddings table.
    """
    embedding_id = str(uuid.uuid4())
    query = """
        INSERT INTO embeddings (id, resource_id, content, embedding)
        VALUES (%s, %s, %s, %s)
    """
    try:
        logger.debug(f"Inserting embedding with ID: {embedding_id} for resource: {resource_id}")
        cursor.execute(query, (embedding_id, resource_id, chunk_content, embedding))
        conn.commit()
        logger.debug("Embedding inserted successfully")
    except Exception as e:
        logger.error(f"Error inserting embedding: {str(e)}")
        conn.rollback()
        raise

# Process each chunk: embed and insert into the DB
logger.info("Beginning processing of chunks")
successful_chunks = 0
failed_chunks = 0

# Set a maximum number of failures before aborting
max_failures = 2
continuous_failures = 0

for key, content in chunks.items():
    try:
        logger.info(f"Processing chunk: {key}")
        embedding = get_embedding(content)
        resource_id = insert_resource(content)
        insert_embedding(resource_id, content, embedding)
        logger.info(f"Successfully processed chunk {key} with resource id {resource_id}")
        successful_chunks += 1
        continuous_failures = 0  # Reset the continuous failure counter on success
    except Exception as e:
        logger.error(f"Failed to process chunk {key}: {str(e)}")
        failed_chunks += 1
        continuous_failures += 1
        
        # If we have too many continuous failures, exit the program
        if continuous_failures >= max_failures:
            logger.error(f"Aborting after {continuous_failures} continuous failures")
            break

# Clean up and report
logger.info(f"Processing complete. Successfully processed {successful_chunks} chunks. Failed: {failed_chunks}")

if cursor:
    cursor.close()
if conn:
    conn.close()
logger.info("Database connection closed")

# Exit with error code if any chunks failed
if failed_chunks > 0:
    sys.exit(1)