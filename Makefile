# Stop Django Backend
stop_be:
	@echo "Stopping Django Backend..."
	-pkill -f 'python manage.py runserver 8000' || true

# Stop React Frontend
stop_fe:
	@echo "Stopping React Frontend..."
	-pkill -f 'npm start' || true

# Start Django Backend
start_be:
	@echo "Starting Django Backend..."
	cd backend && poetry run python manage.py migrate
	cd backend && poetry run python manage.py runserver 8000

# Start React Frontend
start_fe:
	@echo "Starting React Frontend..."
	cd frontend && npm install
	cd frontend && npm start

be: stop_be start_be
fe: stop_fe start_fe

# Start both Django Backend and React Frontend
all:stop_be stop_fe
	@echo "Starting Django Backend and React Frontend..."
	$(MAKE) be &
	$(MAKE) fe &