   
        // Data storage
        let foods = [];
        let targets = {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 65
        };

        // Chart instance
        let nutritionChart;

        // Initialize chart
        function initChart() {
            const ctx = document.getElementById('nutritionChart').getContext('2d');
            nutritionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Karbohidrat', 'Lemak'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: ['#60A5FA', '#FBBF24', '#34D399'],
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        }

        // Add food function
        function addFood(name, portion, calories, protein, carbs, fat) {
            const multiplier = portion / 100;
            const food = {
                id: Date.now(),
                name: name,
                portion: portion,
                calories: Math.round(calories * multiplier),
                protein: Math.round(protein * multiplier * 10) / 10,
                carbs: Math.round(carbs * multiplier * 10) / 10,
                fat: Math.round(fat * multiplier * 10) / 10
            };

            foods.push(food);
            updateDisplay();
            renderFoodList();
            showSuccessMessage(`${name} berhasil ditambahkan!`);
        }

        // Add common food
        function addCommonFood(name, portion, calories, protein, carbs, fat) {
            addFood(name, portion, calories, protein, carbs, fat);
        }

        // Form submission
        document.getElementById('foodForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('foodName').value;
            const portion = parseFloat(document.getElementById('foodPortion').value);
            const calories = parseFloat(document.getElementById('foodCalories').value);
            const protein = parseFloat(document.getElementById('foodProtein').value);
            const carbs = parseFloat(document.getElementById('foodCarbs').value);
            const fat = parseFloat(document.getElementById('foodFat').value);

            addFood(name, portion, calories, protein, carbs, fat);
            
            // Reset form
            this.reset();
        });

        // Update display
        function updateDisplay() {
            const totals = foods.reduce((acc, food) => {
                acc.calories += food.calories;
                acc.protein += food.protein;
                acc.carbs += food.carbs;
                acc.fat += food.fat;
                return acc;
            }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

            // Update totals
            document.getElementById('totalCalories').textContent = Math.round(totals.calories);
            document.getElementById('totalProtein').textContent = Math.round(totals.protein * 10) / 10;
            document.getElementById('totalCarbs').textContent = Math.round(totals.carbs * 10) / 10;
            document.getElementById('totalFat').textContent = Math.round(totals.fat * 10) / 10;

            // Update progress bars
            updateProgressBar('caloriesProgress', totals.calories, targets.calories);
            updateProgressBar('proteinProgress', totals.protein, targets.protein);
            updateProgressBar('carbsProgress', totals.carbs, targets.carbs);
            updateProgressBar('fatProgress', totals.fat, targets.fat);

            // Update chart
            updateChart(totals);
        }

        // Update progress bar
        function updateProgressBar(elementId, current, target) {
            const percentage = Math.min((current / target) * 100, 100);
            document.getElementById(elementId).style.width = percentage + '%';
        }

        // Update chart
        function updateChart(totals) {
            if (nutritionChart) {
                const proteinCalories = totals.protein * 4;
                const carbsCalories = totals.carbs * 4;
                const fatCalories = totals.fat * 9;
                
                nutritionChart.data.datasets[0].data = [proteinCalories, carbsCalories, fatCalories];
                nutritionChart.update();
            }
        }

        // Render food list
        function renderFoodList() {
            const foodList = document.getElementById('foodList');
            
            if (foods.length === 0) {
                foodList.innerHTML = `
                    <div class="text-center text-gray-500 py-8">
                        <span class="text-4xl mb-4 block">🍽️</span>
                        <p>Belum ada makanan yang ditambahkan</p>
                        <p class="text-sm">Mulai tambahkan makanan untuk melacak nutrisi Anda</p>
                    </div>
                `;
                return;
            }

            foodList.innerHTML = foods.map(food => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${food.name}</h4>
                        <p class="text-sm text-gray-600">${food.portion}g - ${food.calories} kal</p>
                        <div class="flex space-x-4 mt-1 text-xs text-gray-500">
                            <span>P: ${food.protein}g</span>
                            <span>K: ${food.carbs}g</span>
                            <span>L: ${food.fat}g</span>
                        </div>
                    </div>
                    <button onclick="removeFood(${food.id})" class="text-red-500 hover:text-red-700 p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        // Remove food
        function removeFood(id) {
            foods = foods.filter(food => food.id !== id);
            updateDisplay();
            renderFoodList();
        }

        // Clear all foods
        function clearAllFoods() {
            if (confirm('Apakah Anda yakin ingin menghapus semua makanan?')) {
                foods = [];
                updateDisplay();
                renderFoodList();
                showSuccessMessage('Semua makanan berhasil dihapus!');
            }
        }

        // Show success message
        function showSuccessMessage(message) {
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove('translate-x-full');
            }, 100);

            setTimeout(() => {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initChart();
            updateDisplay();
            renderFoodList();
        });
    