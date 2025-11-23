### Translation Server

1. The server also exposes a translation POST route at `/api/v1/translate` which is served as a `REST` endpoint and it expect the following json body:

```json
{
  "text": "Hello, How are you?",
  "to": "xh"
}
```

and this will yield the following response:

```json
{
  "success": true,
  "translation": "Molo unjani?"
}
```
