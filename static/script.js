document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("token-count-form");
  const textInput = document.getElementById("text-input");
  const tokenCountDisplay = document.getElementById("token-count");
  const tokenStringsDisplay = document.getElementById("token-strings");

  const backgroundColors = ["#FFE432", "#FFCB25", "#FFAE17", "#FFC17C", "#FFA500", "#FF8C00"];

   // Submit the form when pressing the ENTER key
  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });
  
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

      // Clear the previous tokens
      tokenStringsDisplay.innerHTML = "";

      // Initialize the background color index
      let bgColorIndex = 0;

      data.token_strings.forEach((token, index) => {
        const span = document.createElement("span");
        span.textContent = token;
        span.style.padding = "4px";
        span.style.marginRight = "4px";
        span.style.marginLeft = "4px";

        span.style.borderRadius = "1px";

        // Update the background color index if the token is part of the same word as the previous token
        if (index > 0 && !token.startsWith(" ") && !data.token_strings[index - 1].endsWith(" ")) {
          bgColorIndex = (bgColorIndex + 1) % backgroundColors.length;
          span.style.marginRight = "0px";
          span.style.marginLeft = "0px";


        } else {
          bgColorIndex = 0;
          // span.style.marginRight = "7px";

        }

        span.style.backgroundColor = backgroundColors[bgColorIndex];
       
        tokenStringsDisplay.appendChild(span);
      });
    } else {
      console.error("Failed to fetch token count and token strings");
    }
  });
});
