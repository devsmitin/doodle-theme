# tw-starter

A tailwind css starter using webpack and postcss

This is a boilerplate for using webpack, tailwind css, sass/scss and es6 with babel in your shopify theme. There is no need to make any changes in this structure itself.

## Getting started

### Prerequisites

- [Shopify CLI](https://shopify.dev/themes/getting-started/create#step-1-install-shopify-cli)
- [Node.js](https://nodejs.org/)

### Workflow

A short description of workflow:

1. Clone this project, run below commands:

    ```sh
    git clone https://github.com/devsmitin/tw-shopify.git
    rm -rf .git # remove git
    ```

2. Clone your `awesome-shopify-project` in same directory and run below commands. If you dont have one already, skip to step 3

    ```sh
    mv tw-shopify awesome-shopify-project
    cd your-awesome-project
    npm install
    ```

3. Use below command to download latest version of your theme (assuming that you are already logged in to your store from _shopify-cli_)

    ```sh
    shopify theme pull # select your prefered theme from list - maybe the live theme forto sync latest changes?
    ```

    Once done you can now add git using `git init` command or continue using local source.

4. Now you can add build files to your theme. Add it to your layout file to use globally (prefered) or to any specific section file (as required). You can also load JS file at bottom of you page.

    ```liquid
    {{ 'bundle.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'bundle.js' | asset_url }}" defer="defer"></script>
    ```

### Development commands

You will need a terminal window. Here it is assumed that you are using bash or similar command language. To use this with Windows, you will need to change few commands in `package.json` file.

1. Build your code and serve your Shopify theme
    
    - First, log in to your store if you was not logged in already.
      ```bash
      shopify login --store your-store-name.myshopify.com
      ```
    - Build your code in development mode and serve your theme to your development store
      ```bash
      npm run start
      ```

2. Once done with development, push your code with production build to your desired theme
    ```bash
    npm run publish
    ```

3. You can find and update additional commands in `package.json` file to match your workflow.



## Final notes

### Further reading

- [shopify.dev](https://shopify.dev)
- [Tools for building Shopify themes](https://shopify.dev/themes/tools)
- [Version control for Shopify themes best practices](https://shopify.dev/themes/best-practices/version-control)

### Suggestions

If you have any suggestions to improve this template / repository, please open an issue. I would be happy to hear from you.
