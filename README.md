# Finance Management 

1. Financial Records Management

Create a backend that supports storing and managing financial entries such as income and expenses.

Each record may include fields such as:

Amount

Type such as income or expense

Category

Date

Notes or description

Your application should provide a way to:

Create records

View records

Update records

Delete records

Filter records using criteria such as date, category, or type

The exact data model is up to you, but it should be sensible and clearly structured.

2. Summary and Analytics Logic

Provide backend support for generating useful financial summaries.

Examples may include:

Total income

Total expenses

Current balance

Category wise breakdown

Monthly totals

Recent activity

The purpose here is to evaluate how you process and return meaningful data, not just how you perform CRUD operations.

3. User and Role Handling

Include basic user handling in your system.

You may define roles such as:

Viewer: Can view financial records and summaries

Analyst: Can view records, apply filters, and access detailed insights

Admin: Can create, update, delete, and manage records or users

You do not need to build a highly advanced authentication system unless you want to, but role based behavior should be clear in your application design.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
