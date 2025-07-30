import MultiStepForm from "./components/MultiStepForm";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#FFFBF9" }}>
      <div 
        className="w-full max-w-4xl"
        style={{ 
          backgroundColor: "#FFFBF9",
          borderRadius: "20px",
          border: "3px solid #3099FB",
          padding: "2rem"
        }}
      >
        <MultiStepForm />
      </div>
    </div>
  );
}

export default App;
