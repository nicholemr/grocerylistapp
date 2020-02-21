import React, { useState } from "react";
import FoodList from "./foodList";

const FoodForm = () => {
  const [food_id, setFoodid] = useState("");
  const [food_qty, setQty] = useState("");

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
        <label htmlFor="food_qty">
          Quantity (kg)
          <input
            id="food_qty"
            value={food_qty}
            placeholder="Enter Quantity"
            onChange={event => setQty(event.target.value)}
          />
        </label>
        {food_id}{food_qty}
        <button>Submit</button>
        <FoodList foodId={food_id} foodQty={food_qty}/>
      </form>
    </div>
  );
};

export default FoodForm;
