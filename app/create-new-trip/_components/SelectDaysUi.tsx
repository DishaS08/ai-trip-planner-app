"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  onSelectedOption: (value: string) => void;
};

const SelectDaysUi = ({ onSelectedOption }: Props) => {
  const [days, setDays] = useState<number>(7); // default 7 days

  const increaseDays = () => setDays((prev) => prev + 1);
  const decreaseDays = () => setDays((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex justify-center mt-3">
      <Card className="w-[320px] shadow-md border border-gray-200">
        <CardContent className="p-5 text-center">
          <h3 className="font-semibold text-gray-800 mb-3">
            How many days do you want to travel?
          </h3>

          {/* Counter Section */}
          <div className="flex items-center justify-center gap-5 my-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseDays}
              className="rounded-full w-9 h-9 text-lg"
            >
              −
            </Button>

            <span className="font-bold text-lg">{days} Days</span>

            <Button
              variant="outline"
              size="icon"
              onClick={increaseDays}
              className="rounded-full w-9 h-9 text-lg"
            >
              +
            </Button>
          </div>

          {/* Confirm Button */}
          <Button
            className="mt-2 w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => onSelectedOption(`${days} Days`)}
          >
            Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectDaysUi;
