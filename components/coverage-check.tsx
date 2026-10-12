"use client";
import { useState } from "react";
import { coverageMessage } from "@/config/coverage";
export default function CoverageCheck() {
  const [zip, setZip] = useState("");
  return (
    <div className="panel coverage-check">
      <h2>Check your ZIP code</h2>
      <div className="form-field">
        <label htmlFor="coverage-zip">ZIP code</label>
        <input
          id="coverage-zip"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          aria-describedby="coverage-result"
        />
      </div>
      <p id="coverage-result" role="status">
        {coverageMessage(zip)}
      </p>
    </div>
  );
}
