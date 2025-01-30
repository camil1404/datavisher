document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".content-section, .fullscreen-section"
  ); // Nieuwe sectie toegevoegd
  const airplaneImg = document.querySelector(".airplane-img");
  const imageText = document.querySelector(".image-text");

  let currentSection = 0;
  let isScrolling = false;

  // Show the first section
  sections[0].classList.add("visible");

  // Scroll to a specific section
  const scrollToSection = (index) => {
    // Zoom in/out logic for the image
    if (currentSection === 1) {
      airplaneImg.classList.add("zoom");
      imageText.classList.remove("visible");
    } else if (currentSection === 2) {
      airplaneImg.classList.add("zoom");
      imageText.classList.add("visible");
    } else if (currentSection === 3) {
      airplaneImg.classList.remove("zoom");
      airplaneImg.classList.add("zoom-less"); // Slightly zoomed out on the right
      imageText.classList.remove("visible");
    } else {
      airplaneImg.classList.remove("zoom", "zoom-less");
      imageText.classList.remove("visible");
    }

    setTimeout(() => {
      isScrolling = false;
    }, 1000); // Prevent rapid scrolling
  };

  // Wheel event for smooth section-by-section scrolling
  window.addEventListener(
    "wheel",
    (e) => {
      if (isScrolling) return;

      const delta = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.min(
        Math.max(currentSection + delta, 0),
        sections.length - 1
      );

      if (newIndex !== currentSection) {
        scrollToSection(newIndex);
      }
    },
    { passive: false }
  );

  // Keyboard navigation (optional)
  window.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    if (e.key === "ArrowDown" && currentSection < sections.length - 1) {
      scrollToSection(currentSection + 1);
    } else if (e.key === "ArrowUp" && currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        if (index !== currentSection) {
          sections[currentSection].classList.remove("visible");
          currentSection = index;
          entry.target.classList.add("visible");

          // Zoom in/out logic for the image
          if (currentSection === 1) {
            airplaneImg.classList.add("zoom");
            imageText.classList.remove("visible");
          } else if (currentSection === 2) {
            airplaneImg.classList.add("zoom");
            imageText.classList.add("visible");
          } else if (currentSection === 3) {
            airplaneImg.classList.remove("zoom");
            airplaneImg.classList.add("zoom-less"); // Slightly zoomed out on the right
            imageText.classList.remove("visible");
          } else {
            airplaneImg.classList.remove("zoom", "zoom-less");
            imageText.classList.remove("visible");
          }
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Manually define values for each bar (24 total)
  let data = [
    20, 15, 10, 5, 10, 20, 27, 35, 70, 80, 95, 100, 100, 65, 80, 70, 60, 50, 40,
    37, 46, 42, 40, 30,
  ];

  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  // Create SVG
  const svg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(data.map((_, i) => i))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Draw bars
  const bars = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d))
    .attr("fill", "#ffcc00")
    .attr("stroke", "#333");

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => `${d}:00`));

  // Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));
});

/*bubble chart*/
document.addEventListener("DOMContentLoaded", function () {
  const width = document.getElementById("bubble-chart").clientWidth;
  const height = document.getElementById("bubble-chart").clientHeight;

  const svg = d3
    .select("#bubble-chart")
    .attr("width", width)
    .attr("height", height);

  let data = [
    { value: 200, text: "B737" },
    { value: 185, text: "A320" },
    { value: 10, text: "B747" },
    { value: 45, text: "E190" },
    { value: 2, text: "A380" },
    { value: 40, text: "B772" },
    { value: 16, text: "A350" },
    { value: 10, text: "B767" },
    { value: 50, text: "B737M" },
    { value: 100, text: "A320N" },
    { value: 70, text: "B787" },
    { value: 2, text: "A340" },
    { value: 20, text: "A220" },
    { value: 80, text: "B773" },
  ];

  const radiusScale = d3.scaleSqrt().domain([5, 200]).range([10, 70]);

  const simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force(
      "collide",
      d3.forceCollide((d) => radiusScale(d.value) + 2)
    )
    .on("tick", ticked);

  const bubbles = svg
    .selectAll(".bubble")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bubble");

  bubbles
    .append("circle")
    .attr("r", (d) => radiusScale(d.value))
    .attr("fill", "#ffcc00")
    .attr("opacity", 1);

  bubbles
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("fill", "black")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("pointer-events", "none")
    .text((d) => d.text);

  function ticked() {
    bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

  // ==== ADD LEGEND (Now inside the chart) ====
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 150}, 250)`); // Adjust position

  const legendSizes = [200, 100, 50, 25];

  // Smaller legend bubble scale
  const legendRadiusScale = d3.scaleSqrt().domain([10, 200]).range([5, 25]);

  legendSizes.forEach((size, i) => {
    const yOffset = i * 50; // Reduce spacing

    legend
      .append("circle")
      .attr("cx", 20) // Move closer to text
      .attr("cy", yOffset + 10)
      .attr("r", legendRadiusScale(size)) // Apply smaller scale
      .attr("fill", "#ffcc00")
      .attr("opacity", 1);

    legend
      .append("text")
      .attr("x", 50) // Move text closer
      .attr("y", yOffset + 15)
      .attr("fill", "white")
      .style("font-size", "12px"); // Smaller font
  });

  // Add title for legend
  legend
    .append("text")
    .attr("x", 0)
    .attr("y", -40) // Move closer
    .attr("fill", "white")
    .style("font-size", "14px") // Smaller title
    .style("font-weight", "bold")
    .text("Bigger is More");
});

//scatterplot
// Dataset
const data = [
  { x: 85, y: 200, category: "B737" }, // B737: 85 dB, 200 passengers
  { x: 85, y: 185, category: "A320" }, // A320: 85 dB, 185 passengers
  { x: 95, y: 450, category: "B747" }, // B747: 92 dB, 410 passengers
  { x: 77, y: 114, category: "E190" }, // E190: 80 dB, 114 passengers
  { x: 91, y: 575, category: "A380" }, // A380: 85 dB, 575 passengers
  { x: 87, y: 350, category: "B772" }, // B772: 85 dB, 350 passengers
  { x: 85, y: 350, category: "A350" }, // A350: 80 dB, 350 passengers
  { x: 87, y: 375, category: "B767" }, // B767: 85 dB, 375 passengers
  { x: 81, y: 204, category: "B737M" }, // B737M: 82 dB, 204 passengers
  { x: 82, y: 180, category: "A320N" }, // A320N: 82 dB, 180 passengers
  { x: 84, y: 330, category: "B787" }, // B787: 80 dB, 330 passengers
  // { x: 86, y: 380, category: "A340" }, // A340: 85 dB, 380 passengers
  { x: 78, y: 140, category: "A220" }, // A220: 82 dB, 140 passengers
  { x: 88, y: 400, category: "B773" }, // B773: 85 dB, 400 passengers
];

// Set margins and dimensions
const margin = { top: 20, right: 45, bottom: 80, left: 80 };
const width = 500 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG element
const svg = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define scales
const x = d3
  .scaleLinear()
  .domain([70, d3.max(data, (d) => d.x)])
  .range([0, width]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.y)])
  .range([height, 0]);

// Define gridlines
function make_x_gridlines() {
  return d3.axisBottom(x).ticks(5);
}
function make_y_gridlines() {
  return d3.axisLeft(y).ticks(5);
}

// Add gridlines to the chart
svg
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0,${height})`)
  .call(make_x_gridlines().tickSize(-height).tickFormat(""));

svg
  .append("g")
  .attr("class", "grid")
  .call(make_y_gridlines().tickSize(-width).tickFormat(""));

// Add x and y axes
svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

// Add axis labels
svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 10)
  .attr("text-anchor", "middle")
  .style("fill", "white") // Change text color

  .text("Geluidsniveau in DB");

svg
  .append("text")
  .attr("class", "y-axis-label")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 30) // Adjust this value to make room for the label
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .style("fill", "white") // Change text color
  .text("Aantal passagiers");

// Add data points (dots)
// Add data points (dots)
// Define color scale for different dB ranges
const colorScale = d3
  .scaleLinear()
  .domain([70, 95]) // dB range (adjust if necessary)
  .range(["#e0f7fa", "#00796b"]); // Color range (light blue to dark green)

// Add data points (dots)
svg
  .selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", (d) => x(d.x))
  .attr("cy", (d) => y(d.y))
  .attr("r", 8)
  .style("fill", (d) => {
    // Assign color based on decibel ranges
    if (d.x >= 70 && d.x < 75) return "#e0f7fa"; // Light blue for 70-75 dB
    if (d.x >= 75 && d.x < 80) return "#80deea"; // Slightly darker blue for 75-80 dB
    if (d.x >= 80 && d.x < 85) return "#26a69a"; // Greenish for 80-85 dB
    if (d.x >= 85 && d.x < 90) return "#00796b"; // Dark green for 85-90 dB
    if (d.x >= 90 && d.x < 95) return "#004d40"; // Darker green for 90-95 dB
    return "#000000"; // Default to black for out of range
  })
  .style("stroke", "black")
  .style("stroke-width", 1);

// Add labels for each plane
svg
  .selectAll(".label")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", (d) => x(d.x) + 10) // Offset to the right of the dot
  .attr("y", (d) => y(d.y))
  .attr("font-size", "13px")
  .attr("font-weight", "bold")
  .attr("text-anchor", "start") // Position the label to the right of the dot
  .style("fill", "white") // Change text color
  .text((d) => d.category);
// Ensure that your DOM content is loaded before executing any code
document.addEventListener("DOMContentLoaded", function () {
  // Sample data for the donut chart with customizable values
  const data = [450, 300, 300, 165]; // Modify these values as needed

  // Labels for each section of the donut
  const labels = [
    "Polderbaan",
    "Zwanenburgbaan",
    "Aalsmeerbaan",
    "Buitenveldertbaan",
  ];

  // Set up dimensions and margins for the donut chart
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  // Create SVG container for the donut chart
  const svg = d3
    .select("#pie-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`); // Center the chart

  // Create a pie chart generator
  const pie = d3.pie();

  // Define an arc generator (with innerRadius to make it a donut)
  const arc = d3
    .arc()
    .innerRadius(radius * 0.7) // This makes it a thicker donut
    .outerRadius(radius); // The outer radius remains the same

  // Define a color scale for the sections
  const color = d3.scaleOrdinal(d3.schemeObservable10);

  // Create the donut chart slices
  const slices = svg
    .selectAll("slice")
    .data(pie(data)) // Bind the data to the pie slices
    .enter()
    .append("g") // Create groups for each slice
    .attr("class", "slice");

  // Draw each slice
  slices
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i)); // Color each slice based on its index

  // Optionally, add labels to the slices (outside the donut)
  slices
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text((d, i) => `${d.data}`) // Show section name and value
    .style("fill", "white") // Set the text color to white
    .style("font-weight", "bold"); // Make the text bold

  // Add "1215" in the center of the donut
  svg
    .append("text")
    .attr("class", "center-text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("font-size", "2rem")
    .attr("fill", "#fff")
    .text("1215"); // Change this value as needed

  // Create the legend
  const legend = d3
    .select("#legend")
    .selectAll(".legend-item")
    .data(labels)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-bottom", "10px");

  // Add colored squares for the legend
  legend
    .append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("background-color", (d, i) => color(i))
    .style("margin-right", "10px");

  // Add the labels for the legend
  legend
    .append("span")
    .style("font-size", "1rem")
    .text((d, i) => `${d} - ${data[i]}`); // Display label with its value
});
