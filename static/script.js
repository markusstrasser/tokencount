document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("token-count-form");
  const textInput = document.getElementById("text-input");
  const tokenCountDisplay = document.getElementById("token-count");
  const wordCountDisplay = document.getElementById("word-count");
  const symbolCountDisplay = document.getElementById("symbol-count");
  const getHslString = (index) => `hsl(${60-index*30}, 90%, 80%)`;

  const tokenStringsDisplay = document.getElementById("token-strings");

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
      wordCountDisplay.textContent = textInput.value.split(" ").length;
      symbolCountDisplay.textContent = textInput.value.length

      // Clear the previous tokens
      tokenStringsDisplay.innerHTML = "";

      // Initialize the background color index and parent div
      let bgColorIndex = 0;
      let parentDiv = null;

      data.token_strings.forEach((token, index) => {
        const span = document.createElement("span");
        span.textContent = token;
        span.style.padding = "4px";
        span.style.marginLeft = "4px";
        span.style.borderRadius = "1px";

        // Check if the token is part of the same word as the previous token
        if (index > 0 && !token.startsWith(" ") && !data.token_strings[index - 1].endsWith(" ")) {
          bgColorIndex = bgColorIndex + 1;
          span.style.marginRight = "1px";
        } else {
          // Create a new parent div for the new group
          bgColorIndex = 0;
          parentDiv = document.createElement("div");
          parentDiv.style.display = "inline-block";
          parentDiv.style.padding= "8px";
          parentDiv.style.border = "1px solid black";
          parentDiv.style.borderRadius = "4px";
          parentDiv.style.marginRight = "16px";
          tokenStringsDisplay.appendChild(parentDiv);
        }

        span.style.backgroundColor = getHslString(bgColorIndex);
        parentDiv.appendChild(span);
      });
    } else {
      console.error("Failed to fetch token count and token strings");
    }
  });
});
