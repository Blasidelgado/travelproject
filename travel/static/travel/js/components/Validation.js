export default class Validation {
  static validateDate(date) {
    if (!date) {
      return { valid: false, message: "Please select a valid journey day." };
    }
    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return { valid: false, message: "Invalid date format." };
    }
    const now = new Date();
    if (selectedDate <= now) {
      return { valid: false, message: "The journey must be scheduled at least 2 days in advance." };
    }
    return { valid: true };
  }

  static validateTime(hour, minutes, date) {
    if (!hour || !minutes || !date) {
      return { valid: false, message: "Please select a valid time for the journey." };
    }
    const dt = new Date(date);
    const [hourValue, period] = hour.split(" ");
    const hourInt = parseInt(hourValue, 10);
    if (period === "PM" && hourInt < 12) {
      dt.setHours(hourInt + 12);
    } else if (period === "AM" && hourInt === 12) {
      dt.setHours(0);
    } else {
      dt.setHours(hourInt);
    }
    dt.setMinutes(parseInt(minutes, 10));
    if (isNaN(dt.getTime())) {
      return { valid: false, message: "Invalid time format." };
    }

    return { valid: true, date: dt };
  }

  static validateCities(origin, destination) {
    if (!origin || !destination) return { valid: false, message: "Please select valid origin and destination cities." };
    if (origin === destination) return { valid: false, message: "Origin and destination cannot be the same." };
    return { valid: true };
  }

  static validateSeats(seats) {
    if (!seats || seats <= 0 || seats > 7) return { valid: false, message: "Please select a valid number of seats (1-7)." };
    return { valid: true };
  }

  static validatePrice(price) {
    if (!price || price <= 0 || price > 999) return { valid: false, message: "Please select a valid price (1-999)." };
    return { valid: true };
  }
}