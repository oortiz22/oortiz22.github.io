const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline'); // to get user input


// This function filters out all of the non-vegetarian dishes and creates a csv file with only the vegetarian dishes.
function filterVegetarian(inputFilePath, outputFilePath) 
{
  const filteredData = [];

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => 
    {
      // filter the csv file
      if (row.filter.toLowerCase() === 'vegetarian') 
      {
        filteredData.push(row);
      }
    })
    .on('end', () => 
    {
      // Create a new CSV file with the filtered data
      const header = ['name', 'filter', 'type', 'ingredients'].join(',');
      const data = filteredData.map((row) => [row.name, row.filter].join(',')).join('\n');
      const csvContent = `${header}\n${data}`;

      fs.writeFileSync(outputFilePath, csvContent);

      console.log('Filtered CSV file created successfully.');
    });
} // end of function filterVegetarian


// This function filters out all of the gluten dishes and creates a csv file with only the gluten-free dishes.
function filterGluten(inputFilePath, outputFilePath) 
{
  const filteredData = [];

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => 
    {
      // filter the csv file
      if (row.filter.toLowerCase() === 'gluten-free') 
      {
        filteredData.push(row);
      }
    })
    .on('end', () => 
    {
      // Create a new CSV file with the filtered data
      const header = ['name', 'filter', 'type', 'ingredients'].join(',');
      const data = filteredData.map((row) => [row.name, row.filter].join(',')).join('\n');
      const csvContent = `${header}\n${data}`;

      fs.writeFileSync(outputFilePath, csvContent);

      console.log('Filtered CSV file created successfully.');
    });
} // end of function filterGluten


// This function filters out all of the shellfish dishes and creates a csv file with only the shellfish-free dishes.
function filterShellFish(inputFilePath, outputFilePath) 
{
  const filteredData = [];

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => 
    {
      // filter the csv file
      if (row.filter.toLowerCase() !== 'shellfish') 
      {
        filteredData.push(row);
      }
    })
    .on('end', () => 
    {
      // Create a new CSV file with the filtered data
      const header = ['name', 'filter', 'type', 'ingredients'].join(',');
      const data = filteredData.map((row) => [row.name, row.filter].join(',')).join('\n');
      const csvContent = `${header}\n${data}`;

      fs.writeFileSync(outputFilePath, csvContent);

      console.log('Filtered CSV file created successfully.');
    });
} // end of function filterShellFish


// this function filters based on type
function filterType(inputFilePath, outputFilePath, userInput) {
  const filteredData = []; // array to hold results
  let inputDishType;

  // Read the type of the input dish
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.name.toLowerCase() === userInput.toLowerCase()) {
        inputDishType = row.type.toLowerCase();
      }
    })
    .on('end', () => {
      // Check the type of each row and filter accordingly
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.type.toLowerCase() === inputDishType && row.name.toLowerCase() !== userInput.toLowerCase()) {
            filteredData.push(row);
          }
        })
        .on('end', () => {
          // Create a new CSV file with the filtered data
          const header = ['name', 'filter', 'type', 'ingredients'].join(',');
          const data = filteredData.map((row) => [row.name, row.filter, row.type, row.ingredients].join(',')).join('\n');
          const csvContent = `${header}\n${data}`;

          fs.writeFileSync(outputFilePath, csvContent);

          console.log('Filtered CSV file created successfully.');
        });
    });
} // end of function filterType



// this function filters out all dishes that are not similar to the dish the user inputed
function filterSimilar(inputFilePath, outputFilePath, userInput) {
  const filteredData = []; // array to store results we will return
  let inputDishType; // variable to store the type of the input dish
  let inputDishIngredients = []; // array to store the ingredients of the input dish

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.name.toLowerCase() === userInput.toLowerCase()) // we are on the input dishes row
      {
        inputDishType = row.type.toLowerCase(); // store the type of the input dish
        inputDishIngredients = row.ingredients.split(';').map(ingredient => ingredient.trim()); // store the ingredients of the input dish
      }
    })
    .on('end', () => {
      // Check the type and ingredients of each row and filter accordingly
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => {
          if(row.type.toLowerCase() === inputDishType && row.name.toLowerCase() !== userInput.toLowerCase() && getCommonIngredientsCount(row.ingredients, inputDishIngredients)) 
          {
            filteredData.push(row);
          }
        })
        .on('end', () => {
          // Create a new CSV file with the filtered data
          const header = ['name', 'filter', 'type', 'ingredients'].join(',');
          const data = filteredData.map((row) => [row.name, row.filter, row.type, row.ingredients].join(',')).join('\n');
          const csvContent = `${header}\n${data}`;

          fs.writeFileSync(outputFilePath, csvContent);

          console.log('Filtered CSV file created successfully.');
        });
    });
} // end of function filterSimilar


// helper function for the filterSimilar function
// this function gets the number of common ingredients between the input dish and the dish we are currently on in the csv file
// this function returns true if the number of common ingredients is >= 1 and false if not
function getCommonIngredientsCount(rowIngredients, inputDishIngredients) 
{
  let rowDishIngredients = []; // array to store the ingredients of the row dish
  rowDishIngredients = rowIngredients.split(';').map(ingredient => ingredient.trim()); // store the ingredients of the row dish

  // compare the ingredients of the row dish and the input dish, see if they have one or more ingredients in common
  let count = 0;
  for(let i = 0; i < rowDishIngredients.length; i++)
  {
    if(inputDishIngredients.includes(rowDishIngredients[i]))
    {
      count++;
    }
  }

  return count >= 1; // return true only if the count is greater than or equal to one
} // end of function getCommonIngredientsCount


// this function gets the user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}); // end of function rl


function main() 
{
  const inputFilePath = 'dinner.csv';
  let userInput; // Declare a variable to store user input

  rl.question('Choose a filter (vegetarian, gluten, shellfish, type, or similar): ', (answer) => {
    userInput = answer; // Save the user input in the variable
    console.log(`You chose: ${userInput}!`);

    if(userInput == 'vegetarian')
    {
      const outputFilePath = 'filteredVegetarian.csv';
      filterVegetarian(inputFilePath,outputFilePath);
    }
    else if(userInput == 'gluten')
    {
      const outputFilePath = 'filteredGluten.csv';
      filterGluten(inputFilePath,outputFilePath);
    }
    else if(userInput == 'shellfish')
    {
      const outputFilePath = 'filteredShellFish.csv';
      filterShellFish(inputFilePath,outputFilePath);
    }
    else if(userInput == 'type')
    {
      const outputFilePath = 'filteredType.csv';
      let userInputDish = 'Rigatoni Primavera'; 
      filterType(inputFilePath,outputFilePath, userInputDish);
    }
    else if(userInput == 'similar')
    {
      const outputFilePath = 'filteredSimilar.csv';
      // let userInputDish = 'Rigatoni Primavera'; 
      let userInputDish = 'Branzino';
      
      filterSimilar(inputFilePath, outputFilePath, userInputDish);
    }
    
    rl.close();
  }); // end of r1.question

} // end of function main

if(require.main === module) 
{
  main();
}
