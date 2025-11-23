### Vula Moto

<p align="center">
<img src="/images/adaptive-icon.png" alt="erd" width="200"/>
</p>

### Relationship Models

The `ERD` diagram of models that was used in this project are shown as follow:

<p align="center">
<img src="/images/erd.png" alt="erd" width="100%"/>
</p>

### Starting locally

To test this application locally you need to clone this repository using the following command:

```shell
git clone https://github.com/CrispenGari/vula-moto.git
```

Then you need to setup the server for translation. To do that you first navigate to the server by running the following command:

```shell
cd server
```

Then create a virtual environment and activate it by running the following command:

```shell
virtualenv venv
#
.\venv\Scripts\activate
```

Then we are going to are going to then install the packages by running the following command:

```shell
pip install -r requirements.txt
```

Then you can start the server by running the following command:

```shell
python app.py
```

Then you need to copy the `url` with the IP address and paste it in the `mobile/src/constants/index.ts` so that you will have something that looks as follows:

```ts
export const SERVER_BASE_URL = "http://<IP_ADDRESS_OF_THE_SERVER>:3001";
```

Then we are then going to setup the client for the database by running navigating to the `mobile` folder by running the following command:

```shell
cd mobile
```

And then you will need to install the packages by running the following command:

```shell
yarn
```

Then you need to have environmental variables in the `.env.local` and `.env` so that you will have something like this:

```shell
# .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR>
GOOGLE_MAPS_APIKEY = <YOURS>


# .env.local

CONVEX_DEPLOYMENT=dev:<something> # team: crispengari, project: marketday
EXPO_PUBLIC_CONVEX_URL=https://<something>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE=https://<something>.convex.site
```

Then you can generate some tables and api functions by runing the following command:

```shell
npx convex dev
```
