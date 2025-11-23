
from flask import Blueprint, make_response, jsonify, request
from api.utils import translate_text

blueprint = Blueprint("blueprint", __name__)
@blueprint.route('/translate', methods=["POST"]) 
async def askBot():
    data = {"success": False}
    if request.method == "POST":
        try:
            if request.is_json:
                json_data = request.get_json(force=True)
                if json_data.get("text"):
                    text = await translate_text(json_data.get('to'), json_data.get('text'))
                    data = {
                        'success': True,
                        'translation': text
                    }  
                else:
                    data['error']  = "You should pass the 'text' in your JSON body while making this request."
            else:
                raise Exception("There is no JSON data in your request.")
        except Exception:
            data['error'] = 'Something went wrong on the server'
    else:
        data['error']  = "The request method should be POST only."        
    return make_response(jsonify(data)), 200
