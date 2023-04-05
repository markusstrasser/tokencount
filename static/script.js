document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("token-count-form");
    const textInput = document.getElementById("text-input");
    const tokenCountDisplay = document.getElementById("token-count");
    const tokenStringsDisplay = document.getElementById("token-strings");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const response = await fetch("/count_tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: textInput.value }),
      });
  
      if (response.ok) {
        const data = await response.json();
        tokenCountDisplay.textContent = data.token_count;
        tokenStringsDisplay.textContent = data.token_strings.join(", ");
      } else {
        console.error("Failed to fetch token count and token strings");
      }
    });
  });
  