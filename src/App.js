import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const initialRetirementAge = Number(localStorage.getItem("retirementAge") || 100);
  const initialTargetRetAmt = Number(localStorage.getItem("targetRetAmt") || 0);
  const initialAnnualRetExp = Number(localStorage.getItem("annualRetExp") || 0);
  const initialCurrentAge = Number(localStorage.getItem("currentAge") || 35);
  const initialCurrentSavings = Number(localStorage.getItem("currentSavings") || 10000);
  const initialContributions = Number(localStorage.getItem("contributions") || 500);
  const initialContributionFreq = Number(localStorage.getItem("contributionFreq") || "Monthly");
  const initialPreRetROR = Number(localStorage.getItem("preRetROR") || 7);
  const initialPostRetROR = Number(localStorage.getItem("postRetROR") || 7);
  const initialInflation = Number(localStorage.getItem("inflation") || 2.9);

  const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
  const [targetRetAmt, setTargetRetAmt] = useState(initialTargetRetAmt);
  const [annualRetExp, setAnnualRetExp] = useState(initialAnnualRetExp);
  const [currentAge, setCurrentAge] = useState(initialCurrentAge);
  const [currentSavings, setCurrentSavings] = useState(initialCurrentSavings);
  const [contributions, setContributions] = useState(initialContributions);
  const [contributionFreq, setContributionFreq] = useState(initialContributionFreq);
  const [preRetROR, setPreRetROR] = useState(initialPreRetROR);
  const [postRetROR, setPostRetROR] = useState(initialPostRetROR);
  const [inflation, setInflation] = useState(initialInflation);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency", 
    currency: "USD", 
    minimumFractionDigits: 2,
  });

  const calcRetirementAge = (updatedTargetRetAmt) => {
    const netPreRetROR = (preRetROR - inflation) / 100;
    let currBal = currentSavings;
    const annualCont = contributionFreq === "Annually" ? contributions : contributions * 12;
    let retAge = currentAge;

    while (currBal < updatedTargetRetAmt) {
      currBal = annualCont + currBal * (1 + netPreRetROR);
      retAge += 1;

      if (retAge > 200) break;
    }

    return retAge;
  };

  useEffect(() => {
    localStorage.setItem("retirementAge", retirementAge)
    localStorage.setItem("targetRetAmt", targetRetAmt)
    localStorage.setItem("annualRetExp", annualRetExp)
    localStorage.setItem("currentAge", currentAge)
    localStorage.setItem("currentSavings", currentSavings)
    localStorage.setItem("contributions", contributions)
    localStorage.setItem("contributionFreq", contributionFreq)
    localStorage.setItem("preRetROR", preRetROR)
    localStorage.setItem("postRetROR", postRetROR)
    localStorage.setItem("inflation", inflation)

    // AnnualRetExp <= TargetRetAmt * NetRateOfReturn
    let netPostRetROR = (postRetROR - inflation) / 100;
    if (netPostRetROR === 0) netPostRetROR = 0.0001;

    let updatedTargetRetAmt = annualRetExp / netPostRetROR;
    setTargetRetAmt(updatedTargetRetAmt);

    const retAge = calcRetirementAge(updatedTargetRetAmt);
    setRetirementAge(retAge);
  }, [
    annualRetExp, 
    currentAge, 
    currentSavings, 
    contributions, 
    contributionFreq, 
    preRetROR, 
    postRetROR, 
    inflation
  ])

  return (
    <div className="App">
       <h1>Financial Independence Calculator</h1>
       <h2>You can retire at age {retirementAge}</h2>
       <div>Target retirement amount: {formatter.format(targetRetAmt)}</div>
       <form className="fire-calc-form">

        <label>
          Annual retirement expenses (today's dollars)
          <input 
            type="number" 
            value={annualRetExp} 
            onChange={(e) => setAnnualRetExp(parseInt(e.target.value)) || 0} 
          />
        </label>

        <label>
          Current age
          <input 
            type="number" 
            value={currentAge} 
            onChange={(e) => setCurrentAge(parseInt(e.target.value)) || 0} 
          />
        </label>

        <label>
          Current savings balance
          <input 
            type="number" 
            value={currentSavings} 
            onChange={(e) => setCurrentSavings(parseInt(e.target.value)) || 0}
          />
        </label>

        <label>
          Regular contributions
          <input 
            type="number"
            value={contributions} 
            onChange={(e) => setContributions(parseInt(e.target.value)) || 0}
          />
        </label>

        <label>
          Contribution frequency
          <select 
            value={contributionFreq} 
            onChange={(e) => setContributionFreq(e.target.value)}
          >
            <option>Monthly</option>
            <option>Annually</option>
          </select>
        </label>

        <div>
          <h2>Advanced</h2>

          <label>
            Pre-retirement rate of return
            <input
              type="number"
              value={preRetROR} 
              onChange={(e) => setPreRetROR(parseInt(e.target.value)) || 0}
            />
          </label>

          <label>
            Post-retirement rate of return
            <input 
              type="number"
              value={postRetROR} 
              onChange={(e) => setPostRetROR(parseInt(e.target.value)) || 0}
            />
          </label>

          <label>
            Inflation
            <input 
              type="number"
              value={inflation} 
              onChange={(e) => setInflation(parseFloat(e.target.value)) || 0}/>
          </label>
        </div>

       </form>
    </div>
  );
}

export default App;
