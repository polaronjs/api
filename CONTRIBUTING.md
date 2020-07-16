## Local Development

To run the Polaron API on your local machine, you will need to have an FTP Server and MongoDB instance configured. With [Docker Compose](https://docs.docker.com/compose/) installed, run the following command:

```bash
docker-compose up
```

This will start both of these services in docker containers, ready for use by Polaron. Ensure that the environment that you are running Polaron has the following variables set:

```
MONGO_CONNECTION_URL=mongodb://localhost:27017
FTP_HOST=127.0.0.1
FTP_PORT=2222
FTP_USERNAME=polaron
FTP_PASSWORD=pass
```

Now you're ready to `npm start` 🎉
