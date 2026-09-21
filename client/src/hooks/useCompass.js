import { useState, useEffect, useCallback } from "react";

/**
 * Calculate geographical bearing (initial azimuth) in degrees from point 1 to point 2.
 * Output: 0° = North, 90° = East, 180° = South, 270° = West
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * Get relative angle between user's device orientation (heading) and destination bearing.
 * 0° means the user is facing directly toward the target.
 */
export function getRelativeAngle(bearing, heading) {
  if (heading === null || heading === undefined) return bearing;
  return (bearing - heading + 360) % 360;
}

/**
 * Convert relative angle into an intuitive walking instruction.
 */
export function getWalkingCue(relativeAngle) {
  if (relativeAngle === null || relativeAngle === undefined) return "Follow Path";
  const diff = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;
  const absDiff = Math.abs(diff);

  if (absDiff <= 15) return "Straight Ahead ⬆️";
  if (absDiff <= 45) return diff > 0 ? "Bear Right ↗️" : "Bear Left ↖️";
  if (absDiff <= 105) return diff > 0 ? "Turn Right ➡️" : "Turn Left ⬅️";
  if (absDiff <= 150) return diff > 0 ? "Hard Right ⤵️" : "Hard Left ⤴️";
  return "Turn Around ⬇️";
}

export function useCompass() {
  const [heading, setHeading] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState("prompt"); // "prompt" | "granted" | "denied"
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.DeviceOrientationEvent) {
      setIsSupported(true);
      // Check if iOS 13+ permission request is needed
      if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
        setPermissionState("prompt");
      } else {
        setPermissionState("granted");
      }
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleOrientation = useCallback((event) => {
    let currentHeading = null;

    // iOS provides direct webkitCompassHeading (0 = Magnetic North, clockwise)
    if (typeof event.webkitCompassHeading !== "undefined" && event.webkitCompassHeading !== null) {
      currentHeading = event.webkitCompassHeading;
      if (typeof event.webkitCompassAccuracy !== "undefined") {
        setAccuracy(event.webkitCompassAccuracy);
      }
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // Android / Chrome: alpha is rotation around z-axis (0-360)
      // When absolute flag is set, alpha 0 represents North.
      // In standard orientation, heading is 360 - alpha
      currentHeading = (360 - event.alpha) % 360;
    }

    if (currentHeading !== null && !isNaN(currentHeading)) {
      setHeading(Math.round(currentHeading));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) {
      setError("Device orientation not supported on this device.");
      return false;
    }

    // iOS 13+ requires user gesture to call requestPermission
    if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
      try {
        const response = await window.DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          setPermissionState("granted");
          setError(null);
          return true;
        } else {
          setPermissionState("denied");
          setError("Compass permission was denied.");
          return false;
        }
      } catch (err) {
        setError(err.message || "Failed to request orientation permission.");
        setPermissionState("denied");
        return false;
      }
    } else {
      setPermissionState("granted");
      return true;
    }
  }, []);

  useEffect(() => {
    if (permissionState !== "granted" || typeof window === "undefined") return;

    // Listen to deviceorientationabsolute first (Chrome Android), fallback to deviceorientation
    const hasAbsolute = "ondeviceorientationabsolute" in window;
    const eventName = hasAbsolute ? "deviceorientationabsolute" : "deviceorientation";

    window.addEventListener(eventName, handleOrientation, true);

    return () => {
      window.removeEventListener(eventName, handleOrientation, true);
    };
  }, [permissionState, handleOrientation]);

  return {
    heading,
    accuracy,
    isSupported,
    permissionState,
    requestPermission,
    error,
  };
}
