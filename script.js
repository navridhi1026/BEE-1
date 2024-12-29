// Function to handle form submission
async function submitForm(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const formData = new FormData(document.querySelector("form"));
  const data = Object.fromEntries(formData.entries());

  try {
      const response = await fetch("http://localhost:8000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
      });

      if (response.ok) {
          alert("Data submitted successfully!");
          fetchUsers(); // Fetch and display updated user data
      } else {
          alert("Error submitting data.");
      }
  } catch (error) {
      console.error("Error:", error);
  }
}

// Function to fetch and display user data
async function fetchUsers() {
  try {
      const response = await fetch("http://localhost:8000/users");
      if (response.ok) {
          const users = await response.json();
          displayUsers(users); // Call displayUsers to update the div
      } else {
          console.error("Error fetching user data.");
      }
  } catch (error) {
      console.error("Error:", error);
  }
}

// Function to display users in the form of cards
function displayUsers(users) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Clear previous data

  if (users.length === 0) {
      userList.textContent = "No users registered yet.";
      return;
  }

  users.forEach((user, index) => {
      const userCard = document.createElement("div");
      userCard.classList.add("user-card");
      userCard.innerHTML = `
          <h4>User ${index + 1}</h4>
          <p><strong>Name:</strong> ${user.fname} ${user.lname}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user["phone-number"]}</p>
          <hr>
          <p><strong>Age:</strong> ${user.age}</p>
          <p><strong>Gender:</strong> ${user.gender}</p>
      `;
      userList.appendChild(userCard);
  });
}

// Attach submit handler to the form
document.querySelector("form").addEventListener("submit", submitForm);

// Fetch users on page load
fetchUsers();
