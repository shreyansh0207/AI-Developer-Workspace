import os

from dotenv import load_dotenv
from groq import Groq
from google import genai


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)


GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)


groq_client = None
gemini_client = None


if GROQ_API_KEY:
    groq_client = Groq(
        api_key=GROQ_API_KEY
    )


if GEMINI_API_KEY:
    gemini_client = genai.Client(
        api_key=GEMINI_API_KEY
    )


SYSTEM_PROMPT = """
You are an expert software developer and AI coding assistant.

Your job is to help users generate, explain, debug, improve,
convert, test and document software.

GENERAL RULES:

- Give accurate and practical answers.
- Keep code clean and easy to understand.
- Prefer simple solutions.
- Do not add unnecessary comments.
- Only add comments when they improve understanding.
- Do not provide multiple implementations unless requested.
- Do not repeat the same solution.
- Do not include unnecessary explanations.
- Make sure every required import is included.
- Make sure every function is defined.
- Make sure every variable is defined before use.
- Make sure the code is internally consistent.
- Never reference undefined classes, functions or variables.
- Never invent libraries or APIs.
- Never include fake API keys.
- Never expose secrets.
- When code is requested, provide complete usable code.

GENERATE CODE:

- Create one complete implementation.
- Include all required imports.
- Include all required functions.
- Make the code directly runnable.
- Keep it simple and readable.
- Do not include unrelated examples.

EXPLAIN CODE:

- Explain what the code does.
- Explain the important sections.
- Explain the overall flow.
- Mention important problems if they exist.
- Keep the explanation clear.

DEBUG CODE:

- Identify the likely problem.
- Explain why the problem happens.
- Provide corrected code.
- Do not change unrelated functionality.

IMPROVE CODE:

- Preserve the original functionality.
- Improve readability.
- Improve structure where useful.
- Improve error handling where appropriate.
- Avoid unnecessary complexity.

CONVERT CODE:

- Preserve the original functionality.
- Convert to idiomatic target-language code.
- Include required imports.
- Return complete usable code.

GENERATE TESTS:

- Test important functionality.
- Include useful edge cases.
- Use the requested framework.
- Return ready-to-run tests.

DOCUMENTATION:

- Keep documentation professional.
- Clearly explain setup and usage.
- Explain important functionality.
- Keep it concise and useful.
"""


def build_prompt(
    action: str,
    prompt: str,
    code: str,
    language: str
):

    return f"""
{SYSTEM_PROMPT}

==================================================
TASK
==================================================

Action:
{action}

Programming Language:
{language}

User Instruction:
{prompt if prompt else "No additional instruction provided."}

==================================================
EXISTING CODE
==================================================

{code if code else "No existing code provided."}

==================================================
FINAL CHECK
==================================================

Before answering, make sure:

1. The requested task is completed.
2. Required imports are included.
3. All functions are defined.
4. All variables are defined.
5. The code uses the requested language.
6. The code is internally consistent.
7. The code is directly usable.
8. There is no unnecessary code.
9. There are no unnecessary comments.
10. No secrets or fake API keys are included.

Return the best practical answer.
"""


def ask_groq(prompt: str):

    if not groq_client:

        raise Exception(
            "Groq API key is not configured. "
            "Check GROQ_API_KEY in backend/.env"
        )


    try:

        response = groq_client.chat.completions.create(

            model=GROQ_MODEL,

            messages=[

                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ],

            temperature=0.1,

            max_completion_tokens=4096

        )


        if not response.choices:

            raise Exception(
                "Groq returned no choices."
            )


        result = (
            response
            .choices[0]
            .message
            .content
        )


        if not result:

            raise Exception(
                "Groq returned an empty response."
            )


        return result


    except Exception as error:

        raise Exception(
            f"Groq API error: {str(error)}"
        )


def ask_gemini(prompt: str):

    if not gemini_client:

        raise Exception(
            "Gemini API key is not configured. "
            "Check GEMINI_API_KEY in backend/.env"
        )


    try:

        response = gemini_client.models.generate_content(

            model=GEMINI_MODEL,

            contents=prompt

        )


        if not response.text:

            raise Exception(
                "Gemini returned an empty response."
            )


        return response.text


    except Exception as error:

        raise Exception(
            f"Gemini API error: {str(error)}"
        )


def ask_ai(
    provider: str,
    action: str,
    prompt: str = "",
    code: str = "",
    language: str = "javascript"
):

    final_prompt = build_prompt(

        action=action,

        prompt=prompt,

        code=code,

        language=language

    )


    provider = (
        provider
        .lower()
        .strip()
    )


    if provider == "groq":

        return ask_groq(
            final_prompt
        )


    if provider == "gemini":

        return ask_gemini(
            final_prompt
        )


    if provider == "auto":

        groq_error = None


        try:

            return ask_groq(
                final_prompt
            )


        except Exception as error:

            groq_error = str(error)


        try:

            return ask_gemini(
                final_prompt
            )


        except Exception as error:

            raise Exception(

                "Both AI providers failed.\n\n"

                f"Groq:\n{groq_error}\n\n"

                f"Gemini:\n{str(error)}"

            )


    raise Exception(
        "Invalid provider. "
        "Use Auto, Groq, or Gemini."
    )


#Make the changes in this so that it will run the code properly