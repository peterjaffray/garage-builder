import { useEffect, useState } from "react";
import MultiStepForm from "./components/MultiStepForm";

function App() {
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/hello`)
      .then((res) => res.json())
      .then(() => setApiStatus("success"))
      .catch((err) => {
        console.error("Failed to fetch from API:", err);
        setApiStatus("error");
      });
  }, []);

  const getStatusDot = () => {
    switch (apiStatus) {
      case "loading":
        return (
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        );
      case "success":
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case "error":
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fffbf9" }}>
      <div className="container mx-auto px-4 py-8">
        <MultiStepForm />
      </div>
    </div>
  );
}

export default App;
