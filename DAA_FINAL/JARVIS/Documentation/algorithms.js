define(["geom"], function (geom) {
    /**
     * Defines the style for candidate lines used in the Jarvis Scan Algorithm visualization.
     * @constant
     * @type {Object}
     * @property {string} color - The color of the candidate line (red).
     * @property {number} width - The width of the candidate line (1).
     * @property {string} dash - The dash pattern of the candidate line ('dash').
     * @property {string} name - The name of the candidate line style ('Candidate').
     */
    const CANDIDATE_LINE_STYLE = { color: 'red', width: 1, dash: 'dash', name: 'Candidate' };
  
    /**
     * Defines the style for probe (test) lines used in the Jarvis Scan Algorithm visualization.
     * @constant
     * @type {Object}
     * @property {string} color - The color of the probe line (blue).
     * @property {number} width - The width of the probe line (1).
     * @property {string} dash - The dash pattern of the probe line ('dot').
     * @property {string} name - The name of the probe line style ('Probe').
     */
    const TEST_LINE_STYLE = { color: 'blue', width: 1, dash: 'dot', name: 'Probe' };
  
    /**
     * Implements the Jarvis Scan (Gift Wrapping) Algorithm to find the convex hull of a set of points in the 2D plane.
     * The algorithm starts with the bottommost point and iteratively wraps the set of points with the convex hull,
     * finding the next point on the hull by selecting the point that makes the smallest counter-clockwise angle
     * with the current edge of the hull.
     *
     * @function giftWrap
     * @param {Array<Array<number>>} points - An array of 2D points represented as [x, y] coordinate pairs.
     * @returns {Array<Object>} An array of intermediate states (hull and line lists) for visualization purposes.
     *                          Each state object contains the following properties:
     *                          - lines: An array of line objects representing the candidate and probe lines.
     *                          - hull: An array of points on the convex hull up to the current state.
     */
    function giftWrap(points) {
      var p, pointOnHull, candidate, bottommost = points[0], hull = [], i, j, states = [];
  
      /**
       * Helper function to push the current state (hull and line lists) to the states array.
       *
       * @function pushState
       * @param {Array<Object>} linelist - An array of line objects, each represented as { points: [point1, point2], style: lineStyle }.
       *                                   The lineStyle is either CANDIDATE_LINE_STYLE or TEST_LINE_STYLE.
       */
      function pushState(linelist) {
        states.push({ lines: linelist, hull: hull.slice() });
      }
  
      // Handle the case where there are fewer than 2 points
      if (points.length < 2) {
        return [];
      }
  
      // Find the bottommost point as the starting point for the convex hull
      for (i = 1; i < points.length; i++) {
        p = points[i];
        if (p[1] < bottommost[1] || (p[1] === bottommost[1] && p[0] < bottommost[0])) {
          bottommost = p;
        }
      }
  
      hull = [];
      pointOnHull = bottommost;
  
      // Main loop to find the convex hull
      while (hull.length < 2 || (hull[0] !== pointOnHull)) {
        hull.push(pointOnHull);
        pushState({ points: [], style: {} });
        candidate = null;
  
        // Find the next point on the hull by iterating over the remaining points
        for (j = 0; j < points.length; j++) {
          p = points[j];
          if (p === pointOnHull || p === candidate) continue;
  
          if (candidate === null) {
            // If there is no candidate yet, set the current point as the candidate
            candidate = p;
            pushState([{ points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE }]);
            continue;
          }
  
          // Push the current candidate and test point lines for visualization
          pushState([
            { points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE },
            { points: [pointOnHull, p], style: TEST_LINE_STYLE }
          ]);
  
          // Check if the test point (p) is a better candidate than the current candidate
          // by checking if it makes a smaller counter-clockwise angle with the current edge
          if (geom.isCcwA(pointOnHull, p, candidate)) {
            candidate = p;
            pushState([{ points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE }]);
          }
        }
  
        // Set the selected candidate as the next point on the hull
        pointOnHull = candidate;
      }
  
      hull.push(pointOnHull); // Close the loop by adding the last point
      pushState([]); // Push the final state (empty line list)
  
      return states;
    }
  
    return giftWrap;
  });
  