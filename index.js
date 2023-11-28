
// List that holds every menu item and its information.
const menuItems = [
  { name: 'Cacio e Pepe', 
    description: 'spaghetti; grana padano; butter; pecorino; pepper',
    category: 'vegetarian',
    type: 'pasta',
    imageUrl: './images/cacio-e-pepe.jpg',
    price: 16 },

  { name: 'Gnocchi alla Vodka', 
    description: 'potato dumpling; vodka; ricotta; tomato cream sauce; parmesan',
    category: 'vegetarian',
    type: 'pasta',
    imageUrl: './images/gnocchi-alla-vodka.jpg',
    price: 18 },

  { name: 'Orecchiette',
    description: 'crumbled italian sausage; rapini; shallots; cheese; white wine',
    category: 'none',
    type: 'pasta',
    imageUrl: './images/orecchiette.jpg',
    price: 18 },

  { name: 'Rigatoni Primavera', 
    description: 'rigatoni; garlic; mushrooms; corn; tomatoes; onions; cheese',
    category: 'vegetarian',
    type: 'pasta',
    imageUrl: './images/rigatoni-primavera.jpg',
    price: 18 },

  { name: 'Pappardelle with Short Rib Ragu',
    description: 'braised short rib ragu; cheese',
    category: 'none',
    type: 'pasta',
    imageUrl: './images/short-rib-ragu.jpg',
    price: 21 },

  { name: 'Rigatoni Bolognese',
    description: 'pork; beef; carrots; celery; white wine; tomatoes',
    category: 'none',
    type: 'pasta',
    imageUrl: './images/rigatoni-bolognese.jpg',
    price: 18 },

  { name: 'Linguini White Clam',
    description: 'vongole; onions; white; wine; garlic; crushed; pepper',
    category: 'shellfish',
    type: 'pasta',
    imageUrl: './images/linguine-with-clams.jpg',
    price: 25 },
  
  { name: 'Shrimp Diavolo',
    description: 'shrimp; garlic; onion; red pepper flakes; tomato sauce',
    category: 'none',
    type: 'pasta',
    imageUrl: './images/linguine-and-shrimp.jpg',
    price: 28 },

  { name: 'Chicken Parmigiana',
    description: 'mozzarella; parmesan; spaghetti; san marzano tomatoes',
    category: 'none',
    type: 'meat',
    imageUrl: './images/chicken-parmesan.jpg',
    price: 23 },

  { name: 'Chilean Seabass',
    description: 'seabass; spinach; lemon; butter sauce',
    category: 'gluten-free',
    type: 'fish',
    imageUrl: './images/chilean-seabass.jpg',
    price: 41 },

  { name: 'Skirt Steak Vesuvio',
    description: 'skirt steak; oregano; roasted potatoes; evoo; garlic; white wine; grilled vegetables',
    category: 'gluten-free',
    type: 'meat',
    imageUrl: './images/skirt-steak.jpg',
    price: 34 },

  { name: 'Lamb Chops',
    description: 'lamb; oregano; lemon; grilled asparagus; potatoes',
    category: 'gluten-free',
    type: 'meat',
    imageUrl: './images/lamb-chops.jpg',
    price: 45 },

  { name: 'Eggplant Parmigiana',
    description: 'mozzarella; parmesan; spaghetti; tomatoes',
    category: 'none',
    type: 'pasta',
    imageUrl: './images/eggplant-parmigiana.jpg',
    price: 21 },

  { name: 'Branzino',
    description: 'seabass; mushrooms; onions; tomatoes; rapini; lemon; white wine',
    category: 'gluten-free',
    type: 'fish',
    imageUrl: './images/branzino.jpg',
    price: 36 },

  { name: 'Chicken Peperoncini',
    description: 'seabass; mushrooms; onions; tomatoes; rapini; lemon; white wine',
    category: 'gluten-free',
    type: 'meat',
    imageUrl: './images/chicken-peperoncini.jpg',
    price: 24 },

  { name: 'Grilled Salmon',
    description: 'salmon; asparagus; risotto; lemon; butter sauce',
    category: 'gluten-free',
    type: 'fish',
    imageUrl: './images/grilled-salmon.jpg',
    price: 34 },

  { name: 'Fried Chicken Sliders',
    description: 'lettuce; tomato; spicy aioli; pickle; brioche bun',
    category: 'none',
    type: 'meat',
    imageUrl: './images/fried-chicken-sliders.jpg',
    price: 17 },

  { name: 'Il Mio Burger',
    description: 'lettuce; tomato; spicy aioli;pickle;brioche bun',
    category: 'none',
    type: 'meat',
    imageUrl: './images/il-mio-burger.jpg',
    price: 15 },

  { name: 'Filet Sliders',
    description: 'tenderloin medallions; balsamic; arugula; pepper; brioche bun',
    category: 'none',
    type: 'meat',
    imageUrl: './images/filet-sliders.jpg',
    price: 29 },

  { name: 'Grilled Shrimp',
    description: 'shrimp; garlic; onions; spinach; mozzarella',
    category: 'shellfish',
    type: 'fish',
    imageUrl: './images/grilled-shrimp.jpg',
    price: 18 },

  { name: 'Fried Calamari',
    description: 'marinara sauce; lemon',
    category: 'none',
    type: 'fish',
    imageUrl: './images/fried-calamari.jpg',
    price: 16 },

  { name: 'Whipped Ricotta',
    description: 'cheese; honey; toast',
    category: 'vegetarian',
    type: 'none',
    imageUrl: './images/whipped-ricotta.jpg',
    price: 15 },

  { name: 'Grilled Octopus',
    description: 'octopus; lemon; evoo; tomatoes',
    category: 'gluten-free',
    type: 'fish',
    imageUrl: './images/grilled-octopus.jpg',
    price: 19 },

  { name: 'Sausage Peperonata',
    description: 'sausage; peppers; onions; mushrooms; tomato',
    category: 'gluten-free',
    type: 'meat',
    imageUrl: './images/sausage-peperonata.jpg',
    price: 15 },

  { name: 'Meatball Polenta',
    description: 'meatballs; parmigiano polenta; marinara',
    category: 'gluten-free',
    type: 'meat',
    imageUrl: './images/meatball-polenta.jpg',
    price: 15 },

  { name: 'Prosciutto Burrata',
    description: 'prosciutto di parma; burrata; arugula; evoo',
    category: 'gluten-free',
    type: 'pasta',
    imageUrl: './images/prosciutto-burrata.jpg',
    price: 17 },

  { name: 'Grilled Calamari',
    description: 'balsamic vinaigrette; arugula',
    category: 'gluten-free',
    type: 'fish',
    imageUrl: './images/grilled-calamari.jpg',
    price: 18 },

  { name: 'Honey Pear Crostini',
    description: 'pears; honey; whipped ricotta; walnuts',
    category: 'vegetarian',
    type: 'none',
    imageUrl: './images/honey-pear-crostini.jpg',
    price: 16 },
]

// Generates all of the menu items.
function generateMenuItems(items) {
  // Display all menu items (HTML).
  return items.map(item => `
      <div class="menu-item" data-category="${item.category}" data-type="${item.type}">
          <div class="menu-item-info">
              <div class="menu-item-name" onclick="toggleDescription(this)">${item.name}</div>
              <div class="menu-item-description">${item.description}</div>
              <img src="${item.imageUrl}" alt="${item.name}" width="200">
              <button class="order-button" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button>
          </div>
          <div class="menu-item-price">${item.price}</div>
      </div>
  `).join('');
}

// Displays certain menu items depending on the selected value from the drop down menu.
function applyFilter() {
  // Get the currently selected dietary filter from the dropdown menu.
  const selectedDietaryFilter = document.getElementById('dietary').value;
  // Get the currently selected type filter from the dropdown menu.
  const selectedTypeFilter = document.getElementById('type').value;
  // Select all elements with the class menu-item.
  const menuItems = document.querySelectorAll('.menu-item');

  // Loop through each menu item.
  menuItems.forEach(item => {
    // Determine if the current menu item matches the dietary filter selection.
    const matchesDietaryFilter = selectedDietaryFilter === 'none' || item.getAttribute('data-category') === selectedDietaryFilter;
    // Determine if the current menu item matches the type filter selection.
    const matchesTypeFilter = selectedTypeFilter === 'none' || item.getAttribute('data-type') === selectedTypeFilter;

    // If the dropdown is set to 'none' (show all) or if the items category matches the selected filter:
    if (matchesDietaryFilter && matchesTypeFilter) {
      // Display the item.
      item.style.display = 'block';
    } else {
      // Hide the item.
      item.style.display = 'none';
    }
  });
}

// Perform a search to find like items.
function performSearch() {
  document.querySelector('.menu-container').innerHTML = generateMenuItems(menuItems);
  // Get the searched menu item name.
  let searchName = document.getElementById('searchBar').value.toLowerCase();

  // Get all menu items displayed on the page.
  const displayedMenuItems = document.querySelectorAll('.menu-item');

  // Find the item that matches the searched name.
  let foundItem = menuItems.find(item => item.name.toLowerCase() === searchName);

  // If the item is found:
  if (foundItem) {
      // Extract type and description parts of the found item.
      let searchType = foundItem.type;
      let searchIngredients = foundItem.description.toLowerCase().split(';').map(part => part.trim());

      // Iterate over all displayed menu items.
      displayedMenuItems.forEach(menuItemElement => {
          let itemType = menuItemElement.getAttribute('data-type');
          let itemDescription = menuItemElement.querySelector('.menu-item-description').textContent.toLowerCase().split(';').map(part => part.trim());

          // Check if the current item's type does not match the search type or it does not share any ingredient.
          let notMatch = itemType !== searchType || !itemDescription.some(part => searchIngredients.includes(part) && part !== '');

          // Hide the item if it does not match.
          if (notMatch) {
              menuItemElement.style.display = 'none';
          }
      });
  } else {
      // Show message if no matching items found.
      let resultsContainer = document.getElementById('searchResults');
      resultsContainer.innerHTML = 'Error: No matching items found.';
  }
}
