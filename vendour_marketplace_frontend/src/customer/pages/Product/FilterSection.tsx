import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { teal } from "@mui/material/colors";
import { useState } from "react";
import { colors } from "../../../data/filter/colors";
import { useSearchParams } from "react-router-dom";
import { priceRanges } from "../../../data/filter/price";
import { discounts } from "../../../data/filter/discount";

const FilterSection = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const [expandColor, setExpandColor] = useState<boolean>(false);
  const handleColorToggle = () => {
    setExpandColor(!expandColor);
  };

  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
      searchParams.delete(value);
    }
    setSearchParam(searchParams);
  };

  const clearAllFilters = () => {
    console.log("Clearing filters...");
    setSearchParam(new URLSearchParams());
  };
  return (
    <div className="-z-50 space-y-5 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between h-[40px] px-9">
        <p className="text-lg font-semibold">Filters</p>
        <Button
          size="small"
          className="cursor-pointer font-semibold"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>
      <Divider />
      {/* Color filter */}
      <div className="px-9 space-y-6">
        <section>
          <FormControl>
            <FormLabel
              id="color-filter-label"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: teal[600],
                pb: "14px",
              }}
            >
              Color
            </FormLabel>

            <RadioGroup
              aria-labelledby="color-filter-label"
              defaultValue=""
              name="color"
              onChange={updateFilterParams}
            >
              {colors.slice(0, expandColor ? colors.length : 5).map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio size="small" />}
                  label={
                    <div className="flex items-center gap-3">
                      <p>{item.name}</p>
                      <span
                        style={{ backgroundColor: item.hex }}
                        className={`h-5 w-5 rounded-full ${item.name === "White" ? "border" : ""
                          }`}
                      ></span>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Expand toggle */}
          <div>
            <button
              className="text-primary-color text-sm cursor-pointer hover:underline"
              onClick={handleColorToggle}
            >
              {expandColor ? "Hide" : "Show More"}
            </button>
          </div>
        </section>
        <Divider />
        {/* Price Ranges */}
        <section>
          <FormControl>
            <FormLabel
              id="price-filter-label"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: teal[600],
                pb: "14px",
              }}
            >
              Price
            </FormLabel>

            <RadioGroup
              aria-labelledby="price-filter-label"
              defaultValue=""
              name="price"
              onChange={updateFilterParams}
            >
              {priceRanges.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
        <Divider />

        {/* Discount filter */}
        <section>
          <FormControl>
            <FormLabel
              id="discount-filter-label"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: teal[600],
                pb: "14px",
              }}
            >
              Discounts
            </FormLabel>

            <RadioGroup
              aria-labelledby="discount-filter-label"
              defaultValue=""
              name="discount"
              onChange={updateFilterParams}
            >
              {discounts.map((item) => (
                <FormControlLabel
                  key={item.label}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
