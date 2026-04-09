from flask import Flask, request, jsonify

app = Flask(__name__)

# Store items in memory
items = []

@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    if 'item' not in data:
        return jsonify({'error': 'No item field in request'}), 400
    
    item = data['item']
    if item in items:
        return jsonify({'error': 'Item already exists'}), 400
    
    items.append(item)
    return jsonify({'message': f'Item {item} added successfully'}), 201

@app.route('/items/<item_name>', methods=['DELETE'])
def delete_item(item_name):
    if item_name not in items:
        return jsonify({'error': 'Item not found'}), 404
    
    items.remove(item_name)
    return jsonify({'message': f'Item {item_name} deleted successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
