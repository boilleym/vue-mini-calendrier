/********** Composant calendrier *********/
Vue.component('calendar', {
	template: '#calendar',
	props: {
		display: Boolean,
		month: Number,
		year: Number
	},
	data: function () {
		return {
			short_day_names: ["lu","ma","me","je","ve","sa","di"],
			days: [],
			checked_days: [],
            checked_weekdays: [],
			selection_hover: false
		}
	},
	computed: {
		monthLength() {
			return new Date(this.year, this.month, 0).getDate();
		},
		daysList() { //création de la liste des jours du calendrier
            this.checked_days = []; //RàZ de la sélection à chaque génération de mois.
            this.checked_weekdays = [];
			let days = []
			let monthLength = new Date(this.year, this.month, 0).getDate();
			let monthFirstDay = new Date(this.year, this.month -1 , 1).getDay();
			let monthLastDay = new Date(this.year, this.month, 0).getDay();
            // Jours de semaine vides avant le 1 du mois 
			for (let i = 1; i < monthFirstDay; i++) {
				days.push({empty:true});
			}
            // Jours du mois, renseignés avec leur numéro et leur code jour.
			for (let i = 1; i < monthLength+1; i++) {
				let weekDay = new Date(this.year, this.month -1, i).getDay();
				if( weekDay === 0) weekDay = 7;//contrairement au code par défaut, les index des jours vont de 1(lundi) à 7(dimanche)
				days.push({empty:false, position:i, weekDay:weekDay});
			}
            // Jours de semaine vides après le dernier jour du mois.
			if(monthLastDay > 0) {
				for (let i = 0; i < 7-monthLastDay; i++) {
					days.push({empty:true});
				}
			}
			this.days = days;//la liste des jours du mois est stockée dans le composant pour usage ulterieur
			return days;
		},
	},
	methods: {
		toggleWeekday(event) { //coche ou décoche toutes les dates d'un même jour de semaine
			let weekDay = event.target.id.slice(-1);
			let check = event.target.checked;//action cocher ou décocher
			let selectedDays = [];
            //filtre des jours cible sur tous les jours du mois
			for (let day of this.days) {
				if( day.weekDay == weekDay) {
                    //les jours sont cochés ou décochés en fonction de l'action souhaitée
					let isDayChecked = this.checked_days.indexOf(day.position) > -1 ? true : false;
					if(check && !isDayChecked) this.checked_days.push(day.position);
					if(!check && isDayChecked) this.checked_days.splice(this.checked_days.indexOf(day.position), 1);
				}
			}
		},
		mouseSelect(event) {//selection d'une plage de dates
			if( this.selection_hover) {
				let lastDay =  parseInt(event.target.previousElementSibling.id.slice(3));
				for (let i = this.selection_hover; i < lastDay+1; i++) {
                    if(this.checked_days.indexOf(i) < 0 ) this.checked_days.push(i)
				}
			}
		},
        validCal() { //renvoi la selection vers la vue parente
            this.$emit('selection', this.checked_days);
        }
	}
});

/********** Instance de vue *********/
var demoUbitransport = new Vue({
	el: '#daysPicker',
	data: {
		calendar_display: false,
		month_names : ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
		month: null,
		year: new Date().getFullYear(),
        selection: null
	},
	methods: {
		displayCal() {
			this.calendar_display = true;
            this.selection = null;
		},
        selectedDays(days) {
            this.calendar_display = false;
            this.selection = days.sort((a, b) => a - b);
		}
	}
})