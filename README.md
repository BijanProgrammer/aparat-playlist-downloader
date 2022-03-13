# Aparat Playlist Downloader

A Node.js project that uses puppeteer to extract download links of the videos in a playlists from [Aparat](https://www.aparat.com/).

## How to Use?

1. Open up terminal and clone the project:

    ```shell
    git clone https://github.com/BijanProgrammer/aparat-playlist-downloader.git
    ```

2. Go to the root directory:

    ```shell
    cd aparat-playlist-downloader
    ```

3. Install the dependencies:

    ```shell
    npm i
    ```

4. Create the `.dotenv` file in the root directory and fill it with your desired configs:

    ```
    PAGE_URL=https://www.aparat.com/playlist/373524
    OUTPUT_FOLDER=../output
    VIDEO_QUALITY=1080p
    ```

5. Create the `OUTPUT_FOLDER` (make sure it's name is the same as the one you specified in the `.dotenv` file):

6. Start the project:

    ```shell
    npm start
    ```

7. Gather the links from the `OUTPUT_FOLDER`
