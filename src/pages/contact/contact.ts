import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Survey from 'survey-angular';
declare var noUiSlider: any;
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  encapsulation: ViewEncapsulation.None
})
export class ContactPage {
  public surveyJSON: any;
  surveyModel: Survey.ReactSurveyModel;
  sliderSettings: any;
  sliderWidget: any;
  matrixType:any;
  survey: any;
  mandatoryQuestion: any;
  datepicker: any;
  currentPage: any;
  inputMaskedWidget: any;
  constructor(public navCtrl: NavController,
    private elementRef: ElementRef) {

  }
  ngOnInit() {
    this.matrixType = {
      'Quality': {
        type: '5*5'
      }
    };
    this.sliderSettings = {
      'range': {
        'step': 0.5,
        'start': 1,
        'min': 0,
        'max': 5
      }
    };
    this.surveyJSON = {
      pages: [
        {
          elements: [
            {
              type: 'multipletext',
              items: [
               {
                name: 'First Name'
               },
               {
                name: 'Last Name'
               }
              ],
              name: 'Full Name',
              isRequired: true
             }
          ],
          name: 'page1'
        },
        {
          elements: [
            {
              type: 'dropdown',
              name: 'birthdetails',
              title: 'Select Birth Details',
              isRequired: true,
              colCount: 0,
              choices: ['Date of Birth', 'Time of Birth']
           },
            {
              name: 'birthdate',
              type: 'text',
              inputType: 'date',
              title: 'Your birthdate:',
              isRequired: true,
              visible: false,
              visibleIf: '{birthdetails} = "Date of Birth"'
            },
            {
              type: 'text',
              renderAs: 'inputmask',
              name: 'Time of Birth',
              title: 'Time:',
              visible: false,
              visibleIf: '{birthdetails} = "Time of Birth"'
            }
          ],
          name: 'page2'
        },
        {
          elements: [
            {
              type: 'radiogroup',
              choices: [
               'Cell',
               'Email'
              ],
              title: 'Mode Of Communication',
              name: 'Modeofcommunication',
              isRequired: true
             }
          ],
          name: 'page3'
        },
        {
          elements: [
            {
              type: 'text',
              inputType: 'number',
              name: 'Mobile Number',
              isRequired: true
             }
          ],
          name: 'page4',
          visible: false,
          visibleIf: '{Modeofcommunication} = "Cell"'
        },
        {
          elements: [
            {
              type: 'text',
              inputType: 'email',
              name: 'Email',
              isRequired: true
             }
          ],
          name: 'page5',
          visible: false,
          visibleIf: '{Modeofcommunication} = "Email"'
        },
        {
          elements: [
            {
              type: 'radiogroup',
              choices: [
               'Pincode',
               'Zipcode'
              ],
              title: 'Select Either of them',
              name: 'ModeofLocation'
             },
             {
              type: 'text',
              inputType: 'number',
              name: 'Pincode',
              visibleIf: '{ModeofLocation}="Pincode"'
             },
             {
              type: 'text',
              name: 'Zipcode',
              placeHolder: 'Zipcode',
              visibleIf: '{ModeofLocation}="Zipcode"'
             }
          ],
          name: 'page6'
        },
        {
          elements: [
            { type: 'matrix', name: 'Quality', title: '5 * 5 Matrix User Experience',
            columns: [{ value: 1, text: 'Too Large Text Heading One' },
                       { value: 2, text: 'Too Large Text Heading Two' },
                       { value: 3, text: 'Too Large Text' },
                       { value: 4, text: 'Too Large Text Heading Four' },
                       { value: 5, text: 'Too Large Text Heading Five' },
                       { value: 6, text: 'Too Large Text Heading Six' },
                       { value: 7, text: 'Too Large Text Heading Seven' },
                       { value: 8, text: 'Too Large Text' },
                       { value: 9, text: 'Too Large Text Heading Nine' },
                       { value: 10, text: 'Too Large Text Heading Ten' }],
             rows: [{ value: 'affordable', text: 'Product One' },
                    { value: 'does what it claims', text: 'Product Two' },
                    { value: 'better then others', text: 'Product Three' }, 
                    { value: 'easy to use', text: 'Product Four' },
                    { value: 'affordable1', text: 'Too Large Captioon for Product Six' },
                    { value: 'does what it claims2', text: 'Product Seven' },
                    { value: 'better then others3', text: 'Product Eight' }, 
                    { value: 'easy to use4', text: 'Too Large Captioon for Product Nine' }
                    ]}
          ],
          name: 'page7'
        },
        {
          elements: [
            {
              type: 'checkbox',
              name: 'range',
              title: 'During the past seven days, how much did your PROBLEM affect.',
              isRequired: false,
              renderAs: 'nouislider'
          }
          ],
          name: 'page8'
        }
      ],
      showPageNumbers: true,
      showProgressBar: 'top',
      goNextPageAutomatic: true,
      showNavigationButtons: false
    }
    Survey.Survey.cssType = 'bootstrap';
    Survey.defaultBootstrapCss.navigationButton = 'btn btn-primary';
    Survey.defaultBootstrapCss.navigation.complete = 'complete-btn';
    Survey.defaultBootstrapCss.row = 'row question-box';
    this.createDatePicker();
    Survey.CustomWidgetCollection.Instance.addCustomWidget(this.datepicker);
    Survey.JsonObject.metaData.addProperty('checkbox', { name: 'renderAs', default: 'standard', choices: ['standard', 'nouislider'] });
    // window.survey = new Survey.Model(json);
    this.createSlider();
    Survey.CustomWidgetCollection.Instance.addCustomWidget(this.sliderWidget);
    this.createInputMaskedFields();
    Survey.CustomWidgetCollection.Instance.addCustomWidget(this.inputMaskedWidget);
    Survey.JsonObject.metaData.addProperty('text', { name: 'renderAs', default: 'standard', choices: ['standard', 'inputmask'] });
    this.survey = new Survey.ReactSurveyModel(this.surveyJSON);
    Survey.SurveyNG.render('surveyElement', { model: this.survey });
    this.survey.onAfterRenderQuestion.add(this.afterQuestionRender.bind(this));
    this.survey.onComplete.add(this.sendDataToServer.bind(this));
    this.survey.onCurrentPageChanged.add(this.pageChange.bind(this))
    this.currentPage = this.survey.currentPageNo;
  }
  pageChange(sender, options) {
    this.currentPage = this.survey.currentPageNo;
  }
  cancelSurvey() {
    // this.router.navigate(['dashboard']);
  }

  nextQuestion() {
    this.survey.nextPage();
  }

  previousQuestion() {
    this.survey.prevPage();
  }
  completeSurvey() {
    this.survey.completeLastPage();
    // const completeButton = this.elementRef.nativeElement.querySelector('.complete-btn');
    // completeButton.click();
  }
  afterQuestionRender(sender, options) {
    const self = this;
    console.log('sender', sender, 'options', options.question)
    if(_.keys(self.matrixType).includes(options.question.name)){
      $('#'+ options.question.id + ' div:last-child').addClass('matrix-container')
      $('#'+ options.question.id + ' div:last-child .table tbody td label').addClass('matrix-label')
      // console.log('here', $('#'+ options.question.id + ' div:last-child'))
    }
    // options.htmlElement.class = 'MatrixQuestion';
    // console.log('options after', options)

  }
  sendDataToServer() {
    // this.router.navigate(['dashboard']);
    // console.log('here')
  }
  
  createDatePicker() {
    const self = this;

    this.datepicker = {
      name: 'datepicker',
      htmlTemplate: '<input class="widget-datepicker form-control" type="text" style="width: 100%;">',
      isFit: function (question) {
        console.log('question', question)
        return question['inputType'] === 'date';
      },
      afterRender: function (question, el) {
        const $el = $(el).find('.widget-datepicker');
        $el.attr('id', question.name);
        // $el.attr('placeholder', 'Please enter a date');

        const maxDate = '';
        const minDate = '';


        const minYear = new Date(minDate).getFullYear();
        const maxYear = new Date(maxDate).getFullYear();

        const yearRange = minYear + ':' + maxYear;

        const widget = $el.datepicker({
          onSelect: function (dateText) {
            question.value = dateText;
          },
          onClose: function(dateText, inst) {
            $(this).attr('disabled', false);
          },
          beforeShow: function(input, inst) {
            $(this).attr('disabled', true);
          },
          changeYear: true,
          changeMonth: true,
         // dateFormat: 'dd/mm/yyyy'
        });

        question.valueChangedCallback = function () {
          console.log('question.value', question.value)
          $('#' + question.name).val(question.value);
        };
        

        question.valueChangedCallback();
      },
      willUnmount: function (question, el) {
        $(el).find('.widget-datepicker').datepicker('destroy');
      }
    };
  }
  createSlider() {
    const self = this;
    this.sliderWidget = {
      name: 'nouislider',
      htmlTemplate: '<div id="slider"></div>',
      isFit: function (question) {
        return question['renderAs'] === 'nouislider';
      },
      afterRender: (question, el) => {
        const slider = el.querySelector('#slider');
        noUiSlider.create(slider, {
          start: self.sliderSettings[question.name]['start'],
          connect: [true, false],
          step: self.sliderSettings[question.name]['step'],
          pips: {
            mode: 'steps',
            stepped: false
          },
          range: {
            'min': self.sliderSettings[question.name]['min'],
            'max': self.sliderSettings[question.name]['max']
          },
          tooltips: [true]
        });

        slider.noUiSlider.on('set', function () {
          question.value = slider.noUiSlider.get();
        });
      },
      willUnmount: function (question, el) {
        const slider = el.querySelector('#slider');
        slider.noUiSlider.destroy();
      }
    };
  }
  createInputMaskedFields() {
    const self = this;
    this.inputMaskedWidget = {
      name: 'inputmask',
      isDefaultRender: true,
      isFit: function (question) {
        return question['renderAs'] === 'inputmask';
      },
      afterRender: function (question, el) {

        const $el = $(el).find('input');
        const inputfield = {
          inputType: 'time'
        };
        switch (inputfield.inputType) {
          case 'time':
            $el.inputmask('datetime', { inputFormat: 'HH:MM', alias: 'HH:MM' });
            break;
          default:
            break;
        }

        const updateHandler = function () {
          // $el.inputmask({ setvalue: question.value });
          $('#' + question.name).val(question.value);
        };
        question.valueChangedCallback = updateHandler;
        updateHandler();
      },
      willUnmount: function (question, el) {
        $(el).find('input').inputmask('remove');
      }
    };
  }

}
