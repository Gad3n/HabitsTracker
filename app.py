from flask import Flask, jsonify, request, render_template
from main import Tracker, Habit

app = Flask(__name__)
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
def togle_complete(habit_id):
    try:
        tracker.date_complete(habit_id)
        tracker.save()
        updated_habit = tracker.get_habit(habit_id)
        return jsonify(updated_habit.to_dict()), 200
    except KeyError:
        return jsonify({'error': 'Habit not found'}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
