
export default function Die({ value = 1, locked = false, onClick }) { 

    return (
      <button 
        onClick={onClick} 
        style={{
            all: "unset", 
            display: "flex", 
            alignItems: "center",  
            justifyContent: "center", 
            width: "60px", 
            height: "60px",
            boxSizing: "border-box",
            fontSize: "2rem", 
            color: "black", 
            border: "2px solid #333", 
            borderRadius: "8px", 
            backgroundColor: locked ? "#ddd" : "#fff", 
            cursor: "pointer", 
          }}
          
      >
        {value} {}
      </button>
    );
  }
