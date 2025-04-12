import { useState } from "react"
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Typography,
	Button,
	TextField,
	Checkbox,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
} from "@mui/material"
import { Plus, Trash2, Edit, Check, X } from "lucide-react"

// Initial dummy data
const initialTodos = [
	{ id: 1, text: "Grade midterm exams", completed: false },
	{ id: 2, text: "Prepare lesson plan for next week", completed: true },
	{ id: 3, text: "Schedule parent-teacher meetings", completed: false },
	{ id: 4, text: "Update student progress reports", completed: false },
	{ id: 5, text: "Review curriculum materials", completed: true },
]

function TodoList() {
	const [todos, setTodos] = useState(initialTodos)
	const [newTodo, setNewTodo] = useState("")
	const [editingTodo, setEditingTodo] = useState(null)
	const [editText, setEditText] = useState("")
	const [openDialog, setOpenDialog] = useState(false)

	// Add a new todo
	const addTodo = () => {
		if (newTodo.trim() !== "") {
			const newItem = {
				id: Date.now(),
				text: newTodo,
				completed: false,
			}
			setTodos([...todos, newItem])
			setNewTodo("")
			setOpenDialog(false)
		}
	}

	// Toggle todo completion status
	const toggleTodo = (id) => {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
	}

	// Delete a todo
	const deleteTodo = (id) => {
		setTodos(todos.filter((todo) => todo.id !== id))
	}

	// Start editing a todo
	const startEditTodo = (todo) => {
		setEditingTodo(todo.id)
		setEditText(todo.text)
	}

	// Save edited todo
	const saveEditTodo = (id) => {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)))
		setEditingTodo(null)
	}

	// Cancel editing
	const cancelEdit = () => {
		setEditingTodo(null)
	}

	return (
		<Card className="shadow" style={{ borderRadius: '1rem' }}>
			<CardHeader
				title="Todo List for Teacher"
				action={
					<Button variant="outlined" size="small" startIcon={<Plus size={16} />} onClick={() => setOpenDialog(true)}>
						Add Task
					</Button>
				}
			/>
			<CardContent>

				<List>
					{todos.length === 0 ? (
						<Box textAlign="center" py={3}>
							<Typography color="textSecondary">No tasks yet. Add your first task!</Typography>
						</Box>
					) : (
						todos.map((todo) => (
							<ListItem
								key={todo.id}
								className="mb-2 bg-light rounded"
								secondaryAction={
									editingTodo === todo.id ? (
										<Box>
											<IconButton edge="end" size="small" onClick={() => saveEditTodo(todo.id)}>
												<Check size={18} />
											</IconButton>
											<IconButton edge="end" size="small" onClick={cancelEdit}>
												<X size={18} />
											</IconButton>
										</Box>
									) : (
										<Box>
											<IconButton edge="end" size="small" onClick={() => startEditTodo(todo)}>
												<Edit size={18} />
											</IconButton>
											<IconButton edge="end" size="small" onClick={() => deleteTodo(todo.id)} color="error">
												<Trash2 size={18} />
											</IconButton>
										</Box>
									)
								}
							>
								<ListItemIcon>
									<Checkbox edge="start" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
								</ListItemIcon>
								{editingTodo === todo.id ? (
									<TextField fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} size="small" />
								) : (
									<ListItemText
										primary={
											<Typography
												style={{
													textDecoration: todo.completed ? "line-through" : "none",
													color: todo.completed ? "#6c757d" : "inherit",
												}}
											>
												{todo.text}
											</Typography>
										}
									/>
								)}
							</ListItem>
						))
					)}

				</List>

			</CardContent>

			{/* Add Task Dialog */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Add New Task</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Task"
						fullWidth
						variant="outlined"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button onClick={addTodo} variant="contained" color="primary">
						Add Task
					</Button>
				</DialogActions>
			</Dialog>

		</Card>
	)
}

export default TodoList
