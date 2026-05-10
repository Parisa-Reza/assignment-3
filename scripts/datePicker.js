const input = document.getElementById("hotel-date-input");
const checkinDate = document.getElementById("checkin-date");
const checkoutDate = document.getElementById("checkout-date");
const totalPriceElement = document.getElementById("total-price-value");
const nightPriceElement = document.getElementById("night-price");
const dateBoxes = document.querySelectorAll(".form-date-box");
const bookingForm = document.getElementById("villa-booking-form");
const datePickerModal = document.getElementById("datePickerModal");
const datePickerOverlay = document.getElementById("datePickerOverlay");
const datePickerClose = document.getElementById("datePickerClose");
const datePickerCalendar = document.getElementById("datePickerCalendar");

const pricePerNight = 2026;
const dateSeparator = " - ";

if (nightPriceElement) {
    nightPriceElement.textContent = formatCurrency(pricePerNight);
}

if (totalPriceElement) {
    totalPriceElement.textContent = formatCurrency(0);
}

if (
    input &&
    checkinDate &&
    checkoutDate &&
    totalPriceElement &&
    datePickerModal &&
    datePickerOverlay &&
    datePickerClose &&
    datePickerCalendar &&
    window.HotelDatepicker
) {
    const datepicker = new HotelDatepicker(input, {
        inline: true,
        container: datePickerCalendar,
        clearButton: true,
        submitButton: true,
        topbarPosition: "bottom",
        submitButtonName: "Done",
        format: "YYYY-MM-DD",
        separator: dateSeparator,
        startDate: getToday(),
        minNights: 1,
        selectForward: true,
        enableCheckout: true,
        autoClose: false,
        moveBothMonths: true,
        showTopbar: true,
        preventContainerClose: true,
        onSelectRange: updateSelectedDates
    });

    dateBoxes.forEach((box) => {
        box.addEventListener("click", openDatePickerModal);
    });

    input.addEventListener("change", updateSelectedDates);
    input.addEventListener("afterClear", resetSelectedDates);
    document.addEventListener("click", function (e) {
        if (e.target.closest(".datepicker__clear-button")) {
            resetSelectedDates();
        }

        if (e.target.closest(".datepicker__submit-button") && getSelectedRange()) {
            closeDatePickerModal();
        }
    });

    datePickerOverlay.addEventListener("click", closeDatePickerModal);
    datePickerClose.addEventListener("click", closeDatePickerModal);

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            if (!getSelectedRange()) {
                e.preventDefault();
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && datePickerModal.classList.contains("active")) {
            closeDatePickerModal();
        }
    });
}

function openDatePickerModal() {
    datePickerModal.classList.add("active");
    datePickerModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("date-modal-open");
    input.focus();
}

function closeDatePickerModal() {
    datePickerModal.classList.remove("active");
    datePickerModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("date-modal-open");
}

function updateSelectedDates() {
    const range = getSelectedRange();

    if (!range) {
        resetSelectedDates();
        return;
    }

    const totalNights = getNightCount(range.startDate, range.endDate);

    if (totalNights < 1) {
        resetSelectedDates();
        return;
    }

    checkinDate.textContent = formatDisplayDate(range.startDate);
    checkoutDate.textContent = formatDisplayDate(range.endDate);
    totalPriceElement.textContent = formatCurrency(totalNights * pricePerNight);
}

function resetSelectedDates() {
    checkinDate.textContent = "Select";
    checkoutDate.textContent = "Select";
    totalPriceElement.textContent = formatCurrency(0);
}

function getSelectedRange() {
    const selectedDates = input.value.split(dateSeparator);

    if (selectedDates.length !== 2 || !selectedDates[0] || !selectedDates[1]) {
        return null;
    }

    const startDate = parseDate(selectedDates[0]);
    const endDate = parseDate(selectedDates[1]);

    if (!startDate || !endDate || endDate <= startDate) {
        return null;
    }

    return { startDate, endDate };
}

function parseDate(value) {
    const parts = value.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        return null;
    }

    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function getNightCount(startDate, endDate) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.round((endDate - startDate) / millisecondsPerDay);
}

function getToday() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return formatDateValue(today);
}

function formatDisplayDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function formatDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
    return `USD $${amount.toLocaleString("en-US")}`;
}
