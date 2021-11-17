//Selecting HTML Elements
const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

//Search meal and fetch API
function searchMeal(e) 
{
  e.preventDefault();

  //Clear single meal
  single_mealEl.innerHTML = "";
  //Get search term
  const term = search.value;

  // Check term
  if (term)
   {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2> Search Results for: '${term}' </h2>`;

        // The condition if theres a meal
        if (data.meals == null) {
          resultHeading.innerHTML = `<p> There are no matching search results. Try different search </p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
        <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID ="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            </div>
        </div>
            `
            )
            .join("");
        }
        //Clear the search text
        search.value = "";
      });
  }
  
}

// Fetch Meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      console.log(meal);
      //update DOM function
      addMealToDom(meal);
    });
}

//Fetch Random Meal from API
function getRandomMeal() {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}
// Update DOM function
function addMealToDom(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++)
   {
    if (meal[`strIngredient${i}`])
     {
        ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `
      );
    } 
    else
    {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class='single-meal'>
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="single-meal-info"> 
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""} 
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""} 
      </div>
     <div class="main">
        <p>${meal.strInstructions}</p>
        <h2> Ingredients </h2>
        <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
     </div>
  </div>
  `;
}


// Event Listners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", (e) =>{
  
  // Refactored code to get the mealInfo Attribute
  const mealInfo = e.target;

  if (mealInfo.classList.contains("meal-info"))
   {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
  
});