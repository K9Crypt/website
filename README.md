# K9Crypt

K9Crypt allows you to create and share encrypted messages, and now features a blog system.

## Features

- **Encrypted Messages**: Your messages are secured with end-to-end encryption.
- **Notification System**: Stay informed about important updates, messages, and activities with real-time notifications.
- **Blog System**: Read and share knowledge with a built-in blog feature.

## Installation

Follow the steps below to set up K9Crypt:

### Prerequisites

- [Bun](https://bun.sh/)
- [Pocketbase](https://pocketbase.io/)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/k9crypt/website.git
    cd website
    ```

2. Install the required files:
    ```bash
    bun i
    ```

3. Start the infrastructure:
    ```bash
    bun run dev
    ```

## Pocketbase Installation

### Installing Pocketbase

1. Download and install Pocketbase:
    ```bash
    curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_<version>_linux_amd64.zip -o pocketbase.zip
    unzip pocketbase.zip
    chmod +x pocketbase
    ```

2. Start Pocketbase:
    ```bash
    ./pocketbase serve
    ```

### Creating the "notifications" Collection

1. Go to the Pocketbase admin panel (usually http://localhost:8090/_/).
2. Click on the "Create new collection" button.
3. Enter "notifications" as the collection name.
4. Add the "title" and "description" fields:
    - "title": Text type
    - "description": Text type
5. Save the collection.

### Creating the "blog" Collection

1. In the Pocketbase admin panel, create a new collection named "blog".
2. Add the following fields:
    - "title": Text type
    - "content": Rich text type
    - "author": Text type
    - "image": File type
    - "viewCount": Number type
3. Save the collection.

## Notification System

K9Crypt offers a notification system powered by Pocketbase. This system allows users to receive real-time notifications about account activities, incoming messages, and other important information. By clicking on the notifications, users can access detailed information and perform necessary actions.

## Blog System

K9Crypt now includes a blog feature where users can read. The blog system offers:

- Viewing all posts, popular posts, or recent posts
- Reading individual blog posts
- Sharing blog posts
- View count tracking
- Estimated reading time for each post
- The blog pages are responsive and include loading indicators for a smooth user experience.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.