[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Next.js%20Commerce&demo-description=An%20all-in-one%20starter%20kit%20for%20high-performance%20e-commerce%20sites.&demo-url=https%3A%2F%2Fnext-commerce-v2.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1RzhtOHEvW7xyn9qAsdr5E%2F783c7bbd498d0f3b752637d2efa0bb6e%2FNew_Project__5_.png&project-name=Next.js%20Commerce&repository-name=nextjs-commerce&repository-url=https://github.com/bigcommerce/nextjs-commerce&from=templates&env=BIGCOMMERCE_ACCESS_TOKEN%2CBIGCOMMERCE_CHANNEL_ID%2CBIGCOMMERCE_STORE_HASH%2CBIGCOMMERCE_CANONICAL_STORE_DOMAIN%2CBIGCOMMERCE_API_URL%2CBIGCOMMERCE_CDN_HOSTNAME&envDescription=These%20values%20allow%20you%20to%20connect%20to%20your%20headless%20BigCommmerce%20store.)

# Next.js + BigCommerce

A Next.js 13 and App Router-ready headless storefront template for BigCommerce, featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- [React Server Components (RSCs)](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) and [Suspense](https://react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks)
- Route handlers for mutations
- Edge runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Automatic light/dark mode based on system settings

## Prerequisites

Next.js + BigCommerce requires a [BigCommerce sandbox](https://developer.bigcommerce.com/api-docs/partner/create-a-sandbox) or a [production store provisioned to run a headless storefront](https://www.bigcommerce.com/solutions/multi-store/). Consult the following articles in BigCommerce's DevDocs for configuration and guidance:

- [Next.js + BigCommerce Configuration](https://developer.bigcommerce.com/api-docs/storefronts/nextjs-commerce)
- [Guide to Building Headless Storefronts](https://developer.bigcommerce.com/api-docs/storefronts/guide/overview)

## Develop locally

<!-- +++ TODO: clarify that deploy button & auto repo creation is great and the way to go -->

To run Next.js + BigCommerce, use the environment variables [defined in .env.example](.env.example). The best practice is to use [Vercel environment variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: Do not commit your `.env` file. It exposes secrets that allow others to control your BigCommerce store.

1. Install the Vercel CLI:

```bash
npm i -g vercel
```

2. Link your local instance with the desired Vercel and GitHub accounts. This action creates a `.vercel` directory:

```bash
vercel link
```

3. Download the [Vercel environment variables](https://vercel.com/docs/concepts/projects/environment-variables):

```bash
vercel env pull
```

4. Install the app's default dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The app runs on [localhost:3000](http://localhost:3000/).

## Configure checkout

- [Optimized One-Page Checkout](https://developer.bigcommerce.com/stencil-docs/customizing-checkout/optimized-one-page-checkout)
- [Stencil theme to customize checkout page](https://developer.bigcommerce.com/stencil-docs/getting-started/about-stencil#stencil-cli) and inform styling of shopper emails

## Get to know the BigCommerce GraphQL Storefront API

In addition to being compatible with BigCommerce's multi-storefront features, Next.js + BigCommerce uses the [GraphQL Storefront API](https://developer.bigcommerce.com/api-docs/storefront/graphql/graphql-api-overview). This API makes it possible for merchants to control the representation of products and categories, carts, orders, customer segmentation, and more. To get a sense of what is possible to do directly on the storefront, check out the dedicated [GraphQL Playground](https://developer.bigcommerce.com/graphql-storefront/playground) for the sandbox.

<!-- ++++ TODO: directions on accessing the playground -->

## Explore BigCommerce features

BigCommerce's open SaaS feature set powers your store. Visit the BigCommerce developer documentation to learn more about your options for the following features:

Core store configuration:

- [Catalog management](https://developer.bigcommerce.com/docs/rest-catalog)
- [Multi-Storefront and alternate channel sales](https://developer.bigcommerce.com/api-docs/multi-storefront/overview)
- [Buy Online, Pick up in Store](https://developer.bigcommerce.com/buy-online-pick-up-in-store/overview), also known as Click and Collect
- [Webhooks](https://developer.bigcommerce.com/docs/webhooks/overview)

Shopper journeys:

- [GraphQL Storefront Faceted Search](https://developer.bigcommerce.com/api-docs/storefront/graphql/graphql-faceted-textual-search)
- [Promotions](https://developer.bigcommerce.com/promotions/overview)
- [Customer Segmentation](https://developer.bigcommerce.com/customer-segmentation/overview)
- [GraphQL Storefront Carts and Checkouts]()
- [Abandoned Carts](https://developer.bigcommerce.com/docs/rest-management/abandoned-carts)
- [Payments](https://developer.bigcommerce.com/docs/rest-payments)
- [Tax](https://developer.bigcommerce.com/docs/rest-management/tax-settings#get-tax-settings)
- [Orders](https://developer.bigcommerce.com/api-docs/storefronts/guide/orders)
- [Emails](https://developer.bigcommerce.com/docs/rest-content/email-templates)
- [Shipping](https://developer.bigcommerce.com/docs/rest-management/shipping-v2)

## Join our developer community

We invite you to give feedback and ask questions in our [Developer Community](/community) BigCommerceDevs Slack or Discord server.
