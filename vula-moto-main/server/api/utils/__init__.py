from googletrans import Translator
translator = Translator()


async def translate_text(to: str, text: str) -> str:
    try:
        async with Translator() as translator:
            translated = await translator.translate(text, dest=to)
            return translated.text
    except Exception as e:
        return f"Translation error: {str(e)}"
