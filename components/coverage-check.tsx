"use client";
import { useState } from "react";
import { coverageMessage } from "@/config/coverage";
export default function CoverageCheck({ spanish = false }: { spanish?: boolean }) {
  const [zip, setZip] = useState("");
  return (
    <div className="panel coverage-check">
      <h2>{spanish ? "Consulte su código postal" : "Check your ZIP code"}</h2>
      <div className="form-field">
        <label htmlFor="coverage-zip">{spanish ? "Código postal" : "ZIP code"}</label>
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
        {coverageMessage(zip, spanish)}
      </p>
    </div>
  );
}
