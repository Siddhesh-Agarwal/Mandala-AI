# Plan and Design

______

## Endpoints

### `/api/health`

This endpoint is used to check the health of the server.

### `/api/generate`

This endpoint is used to generate a pair of new images. The images are generated and added to the database (Cloudflare D1). To save the images, we will use Cloudflare R2. To prevent abuse of the API, the endpoint will return a cached result

### `/api/images`

This endpoint is used to retrieve a list of all images in the database. The response is a JSON array of image objects. Also takes in the following query parameters:

- `limit`: The maximum number of images to return. Default is 10.
- `offset`: The number of images to skip before returning results. Default is 0.
- `pattern`: The pattern to filter images by. Can be "kolam", "rangoli", or "all". Default is "all".
- `festiveMode`: A boolean indicating whether to filter images by festive mode. Default is false.

### `/api/image/<id>`

This endpoint is used to retrieve a specific image from the database. The response is a JSON object representing the image.

______

## Database

We use Cloudflare D1 to store our images. It provides a free but reliable way to store and retrieve images. The schema is as follows:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for the image |
| url         | TEXT      | URL of the image |
| pattern     | TEXT      | Pattern of the image |
| festiveMode | BOOLEAN   | Whether the image is in festive mode |
| createdAt   | DATETIME  | Timestamp when the image was created |

______

## Object Storage

We would be using Cloudflare R2 to store the images. The images are stored in a bucket named "images". 
