# tw-starter

A tailwind css starter using webpack and postcss

This is a boilerplate for using webpack, tailwind css, sass/scss and es6 with babel in your shopify theme. There is no need to make any changes in this structure itself.

## Workflow

A short description of this workflow:

- Clone your Shopify theme to the `shopify` directory
- Edit theme locally using the Shopify CLI, Tailwind and Webpack
- Commit changes to the feature branch
- Merge feature branch with main branch once development is done

This template acts as a wrapper for Shopify theme. The `shopify` directory holds the Shopify theme files along with your source files, which makes it compatible with Shopify / GitHub integrtion. Source files are located within `shopify/src` directory and it is ignored by Shopify when pushing to the store.

## Getting started

### Prerequisites

- [Shopify CLI](https://shopify.dev/themes/getting-started/create#step-1-install-shopify-cli)
- [Node.js](https://nodejs.org/)

### Installation

1. Run the following commands:

    ```bash
    git clone https://github.com/devsmitin/tw-shopify.git
    mv tw-shopify your-awesome-project
    cd your-awesome-project
    npm install
    rm -rf .git
    ```

2. Clone your shopify theme in `root` directory and rename it to `shopify`, which will merge it with the `shopify` directory of template.

3. Make sure the output file (`shopify/assets/bundle.css`) is included in the `head` of your `shopify/layout/theme.liquid` file.

    ```liquid
    {{ 'bundle.css' | asset_url | stylesheet_tag }}
    ```
    
    The same holds for `bundle.js` file created by Webpack. Ideally, it is best practice to include this file just before the end of `body` tag in the same file, but you can put this anywhere as per requirement. You can do this with the following line of code:

    ```liquid
    <script src="{{ 'bundle.js' | asset_url }}" defer="defer"></script>
    ```

4. In the first step, we removed git from this template using last command as there is no need to make any changes to this perticular template. You are required to commit changes within the `shopify` directory only.


### Development

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
