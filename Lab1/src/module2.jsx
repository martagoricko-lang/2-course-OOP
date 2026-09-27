import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";

export default function Module2Modal({ onConfirm, onCancel }) {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return <Step1 onNext={() => setStep(2)} onCancel={onCancel} />;
  }

  return (
    <Step2
      onBack={() => setStep(1)}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
