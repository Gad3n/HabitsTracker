import os
from flask import Flask, jsonify, request, render_template
from main import Tracker, Habit
from pyngrok import ngrok
import pyngrok.conf

app = Flask(__name__)
ngrok.set_auth_token('3AgLlX0vHV48rlnTDWRdJOgIr99_5Jf6t7F81JUBnkdmsjgYY')
pyngrok.conf.get_default().region = 'eu'
tracker = Tracker()
tracker.load()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/habits', methods=['GET'])
def get_habits():
    return jsonify([habit.to_dict() for habit in tracker.habits.values()])


@app.route('/habits', methods=['POST'])
def create_habits():
    data = request.get_json()

    if not data or 'habit_name' not in data:
        return jsonify({'error': 'Missing habit name'}), 400

    name = data['habit_name']
    color = data.get('habit_color', '')

    new_id = tracker.add_habit(name, color)
    tracker.save()

    new_habit = tracker.get_habit(new_id)

    return jsonify(new_habit.to_dict()), 201


@app.route('/habits/<int:habit_id>/complete', methods=['POST'])
def toggle_complete(habit_id):
    try:
        tracker.date_complete(habit_id)
        tracker.save()
        updated_habit = tracker.get_habit(habit_id)
        return jsonify(updated_habit.to_dict()), 200
    except KeyError:
        return jsonify({'error': 'Habit not found'}), 404


@app.route('/habits/<int:habit_id>/delete', methods=['POST'])
def button_delete(habit_id):
    if tracker.delete_habit(habit_id):
        return jsonify({'messege': 'Habit deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Delete error!'}), 404


if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        tunnels = ngrok.get_tunnels()
        for tunnel in tunnels:
            ngrok.disconnect(tunnel.public_url)

        public_url = ngrok.connect(5000).public_url
        print(f'Link:{public_url}')
    app.run(port='5000', debug=True)
