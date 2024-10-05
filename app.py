from flask import Flask, redirect, render_template, url_for, request, jsonify

app = Flask(__name__)

todos = []

@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
def home():
    if request.method == 'POST':
        todo_name = request.form.get('todo_name')
        todo_date = request.form.get('todo_date')
        todo_description = request.form.get('todo_description')

        if todo_name and todo_date and todo_description:
            new_id = max([todo['id'] for todo in todos], default=0) + 1
            todos.append({
                'id': new_id,
                'name': todo_name,
                'date': todo_date,
                'description': todo_description,
                'checked': False
            })
        return redirect(url_for('home'))
    
    return render_template('index.html', items=todos)

@app.route('/toggle/<int:todo_id>', methods=['POST'])
def toggle_todo(todo_id):
    data = request.get_json()
    checked = data.get('checked')
    
    # Cập nhật trạng thái của todo
    todo = Todo.query.get(todo_id)
    if todo:
        todo.checked = checked
        db.session.commit()
        return jsonify(success=True)

    return jsonify(success=False), 404


@app.route("/delete/<int:todo_id>")
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return redirect(url_for('home'))

@app.route("/update/<int:todo_id>", methods=["POST"])
def update_todo(todo_id):
    todo_to_update = next((todo for todo in todos if todo['id'] == todo_id), None)

    if todo_to_update:
        data = request.get_json()
        todo_to_update['name'] = data.get('name')
        todo_to_update['date'] = data.get('date')
        todo_to_update['description'] = data.get('description')
    return jsonify(success=True)


@app.route("/search", methods=["POST"])
def search_todo():
    query = request.form.get('search_query')
    filtered_todos = [todo for todo in todos if query.lower() in todo['name'].lower()]
    return render_template('index.html', items=filtered_todos)


if __name__ == "__main__":
    app.run(debug=True)
