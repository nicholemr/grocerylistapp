import React, { useState } from "react";

const FoodForm = () => {
  const [food_id, setFoodid] = useState("Enter Food ID");

  return (
    <div className="search-food">
      <form>
        <label htmlFor="food_id">
          Food ID:
          <input
            id="food_id"
            value={food_id}
            placeholder="Enter Food ID"
            onChange={event => setFoodid(event.target.value)}
          />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default FoodForm;
