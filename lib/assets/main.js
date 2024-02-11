import * as Vue from "https://cdn.jsdelivr.net/npm/vue@3.2.26/dist/vue.esm-browser.prod.js";

export function init(ctx, info) {
  ctx.importCSS("main.css");
  ctx.importCSS(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
  );

  const BaseSelect = {
    name: "BaseSelect",

    props: {
      label: {
        type: String,
        default: "",
      },
      selectClass: {
        type: String,
        default: "input",
      },
      modelValue: {
        type: String,
        default: "",
      },
      options: {
        type: Array,
        default: [],
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      inline: {
        type: Boolean,
        default: false,
      },
      grow: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      available(value, options) {
        return value
          ? options.map((option) => option.value).includes(value)
          : true;
      },
    },

    template: `
    <div v-bind:class="[inline ? 'inline-field' : 'field', grow ? 'grow' : '']">
      <label v-bind:class="inline ? 'inline-input-label' : 'input-label'">
        {{ label }}
      </label>
      <select
        :value="modelValue"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
        v-bind:class="[selectClass, { unavailable: !available(modelValue, options) }]"
      >
        <option v-if="!required && !available(modelValue, options)"></option>
        <option
          v-for="option in options"
          :value="option.value"
          :key="option"
          :selected="option.value === modelValue"
        >{{ option.label }}</option>
        <option
          v-if="!available(modelValue, options)"
          class="unavailable"
          :value="modelValue"
        >{{ modelValue }}</option>
      </select>
    </div>
    `,
  };

  const BaseInput = {
    name: "BaseInput",

    props: {
      label: {
        type: String,
        default: "",
      },
      inputClass: {
        type: String,
        default: "input",
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      inline: {
        type: Boolean,
        default: false,
      },
      grow: {
        type: Boolean,
        default: false,
      },
      number: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      emptyClass() {
        if (this.modelValue === "") {
          return "empty";
        }
      },
    },

    template: `
    <div v-bind:class="[inline ? 'inline-field' : 'field', grow ? 'grow' : '']">
      <label v-bind:class="inline ? 'inline-input-label' : 'input-label'">
        {{ label }}
      </label>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        v-bind:class="[inputClass, number ? 'input-number' : '', emptyClass]"
      >
    </div>
    `,
  };

  const BaseSwitch = {
    name: "BaseSwitch",

    props: {
      label: {
        type: String,
        default: "",
      },
      modelValue: {
        type: Boolean,
        default: true,
      },
      inline: {
        type: Boolean,
        default: false,
      },
      grow: {
        type: Boolean,
        default: false,
      },
    },

    template: `
    <div v-bind:class="[inline ? 'inline-field' : 'field', grow ? 'grow' : '']">
      <label v-bind:class="inline ? 'inline-input-label' : 'input-label'">
        {{ label }}
      </label>
      <div class="input-container">
        <label class="switch-button">
          <input
            :checked="modelValue"
            type="checkbox"
            @input="$emit('update:modelValue', $event.target.checked)"
            v-bind="$attrs"
            class="switch-button-checkbox"
            v-bind:class="[inputClass, number ? 'input-number' : '']"
          >
          <div class="switch-button-bg" />
        </label>
      </div>
    </div>
    `,
  };

  const BaseSecret = {
    name: "BaseSecret",

    components: {
      BaseInput: BaseInput,
      BaseSelect: BaseSelect,
    },

    props: {
      textInputName: {
        type: String,
        default: "",
      },
      secretInputName: {
        type: String,
        default: "",
      },
      toggleInputName: {
        type: String,
        default: "",
      },
      label: {
        type: String,
        default: "",
      },
      toggleInputValue: {
        type: [String, Number],
        default: "",
      },
      secretInputValue: {
        type: [String, Number],
        default: "",
      },
      textInputValue: {
        type: [String, Number],
        default: "",
      },
      modalTitle: {
        type: String,
        default: "Select secret",
      },
      required: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      selectSecret() {
        console.log("Inside secret select");
        const preselectName = this.secretInputValue;
        ctx.selectSecret(
          (secretName) => {
            console.log(secretName);
            this.$emit("update:secretInputValue", secretName);
            this.$emit("update:textInputValue", secretName);
          },
          preselectName,
          { title: this.modalTitle }
        );
      },
    },

    template: `
      <div class="input-icon-container grow">
        <BaseInput
          v-if="toggleInputValue"
          :name="secretInputName"
          :label="label"
          :value="secretInputValue"
          inputClass="input input-icon"
          :grow
          readonly
          @click="selectSecret"
          @input="$emit('update:secretInputValue', $event.target.value)"
          :required="!secretInputValue && required"
        />
        <BaseInput
          v-else
          :name="textInputName"
          :label="label"
          type="text"
          :value="textInputValue"
          inputClass="input input-icon-text"
          :grow
          @input="$emit('update:textInputValue', $event.target.value)"
          :required="!textInputValue && required"
        />
        <div class="icon-container">
          <label class="hidden-checkbox">
            <input
              type="checkbox"
              :name="toggleInputName"
              :checked="toggleInputValue"
              @input="$emit('update:toggleInputValue', $event.target.checked)"
              class="hidden-checkbox-input"
            />
            <svg v-if="toggleInputValue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  width="22" height="22">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zM5
                10v10h14V10H5zm6 4h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2zm1-6V7a4 4 0 1 0-8 0v1h8z" fill="#000"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M21 3v18H3V3h18zm-8.001 3h-2L6.6 17h2.154l1.199-3h4.09l1.201 3h2.155l-4.4-11zm-1 2.885L13.244
                12h-2.492l1.247-3.115z" fill="#445668"/>
            </svg>
          </label>
        </div>
      </div>
    `,
  };

  const BaseInputTable = {
    name: "BaseInputTable",
    components: {
      BaseSwitch, // Ensure BaseSwitch is correctly imported or defined
      BaseSecret,
    },
    props: {
      modelValue: Array,
      currentTab: String,
    },
    data() {
      return {
        addRow: { active: true, key: "", value: "", isSecretValue: false },
        focusedRowIndex: null,
        inputs: {},
      };
    },
    computed: {
      newRowIndex() {
        return this.modelValue.length;
      },
    },
    methods: {
      handleInput(index, field, value) {
        // If editing the last row, append a new empty row - only if not already appended
        if (index === this.newRowIndex) {
          this.focusedRowIndex = index;
          this.modelValue.push({
            ...this.addRow,
          });
          this.addRow = {
            active: true,
            key: "",
            value: "",
            isSecretValue: false,
          };
          this.$nextTick(() => {
            this.inputs[`${field}-${index}`].focus();
          });
        } else {
          this.modelValue[index][field] = value;
        }
        this.emitModelValueUpdate();
      },
      deleteRow(index) {
        this.modelValue.splice(index, 1);
        this.emitModelValueUpdate();
      },
      handleFocus(index) {
        this.focusedRowIndex = index;
      },
      handleBlur() {
        this.focusedRowIndex = null;
      },
      emitModelValueUpdate() {
        // Emit an event with the updated rows array
        this.$emit("update:modelValue", this.modelValue);
      },
    },
    template: `
      <div>
        <table class="base-input-table">
          <thead>
            <tr>
              <th>Active</th>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in modelValue" :key="index" class="table-row">
              <td><BaseSwitch v-model="row.active" /></td>
              <td>
                <input type="text" v-model="row.key"  placeholder="Key"
                  :ref="(el) => { inputs['key-'+index] = el; }"
                  @input="handleInput(index, 'key', $event.target.value)"
                  @focus="handleFocus(index)" @blur="handleFocus(index)">
              </td>
              <td>
                <BaseSecret
                    :ref="(el) => { inputs['value-'+index] = el; }"
                    textInputName="value"
                    secretInputName="value"
                    toggleInputName="isSecretValue"
                    label=""
                    v-model:textInputValue="row.value"
                    v-model:secretInputValue="row.value"
                    v-model:toggleInputValue="row.isSecretValue"
                    modalTitle="Set value"
                    @focus="handleFocus(index)" 
                    @blur="handleBlur(index)"
                />
                <!-- Apply conditional rendering for the delete icon -->
                <span v-show="focusedRowIndex !== index" class="delete-icon" @click="deleteRow(index)">
                &#10006; <!-- Simple 'X' icon, can be replaced with an SVG or Font Awesome icon -->
                </span>
            </td>
            </tr>
            <tr id="newRow" :key="newRowIndex" class="table-row">
              <td><BaseSwitch v-model="addRow.active" /></td>
              <td>
                <input type="text" v-model="addRow.key"  placeholder="Key"
                  @input="handleInput(newRowIndex, 'key', $event.target.value)"
                  @focus="handleFocus(newRowIndex)" @blur="handleFocus(newRowIndex)">
              </td>
              <td>
                <BaseSecret
                    textInputName="value"
                    secretInputName="value"
                    toggleInputName="isSecretValue"
                    label=""
                    v-model:textInputValue="addRow.value"
                    v-model:secretInputValue="addRow.value"
                    v-model:toggleInputValue="addRow.isSecretValue"
                    modalTitle="Set value"
                    @focus="handleFocus(newRowIndex)" 
                    @blur="handleBlur(newRowIndex)"
                />
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };

  const ReqRequestForm = {
    components: {
      BaseSwitch,
      BaseInputTable,
    },
    props: {
      currentTab: {
        type: String,
        default: "params",
      },
      modelValue: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        tabs: ["options", "steps", "plugins"],
        step_types: ["request_steps", "response_steps", "error_steps"],
        current_step: "request_steps",
      };
    },
    computed: {
      currentSteps() {
        return this.modelValue[this.current_step];
      },
    },
    methods: {
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
    },
    template: `
    <div v-if="currentTab === 'steps'">
        <div class="radio-buttons">
        <div v-for="(step_type, index) in step_types" :key="index" >
          <input type="radio" name="currentStep" :id="step_type" :value="step_type" v-model="current_step">
          <label :for="step_type">{{ capitalize(step_type.split('_')[0]) }}</label>
        </div>
        </div>
  
        <table class="base-input-table">
          <thead>
            <tr>
              <th></th>
              <th>Step</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in currentSteps" :key="index">
              <td><BaseSwitch v-model="row.active" /></td>
              <td>
                {{ row.name }}
              </td>
              <td>
                {{ row.doc }}
            </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="currentTab === 'plugins'">
        <table class="base-input-table">
          <thead>
            <tr>
              <th></th>
              <th>Step</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in modelValue" :key="index">
              <td><BaseSwitch v-model="row.active" /></td>
              <td>
                {{ row.name }}
              </td>
              <td>
                {{ row.description }}
            </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BaseInputTable 
        v-if="currentTab === 'options'" 
        v-model="modelValue" 
        />
    `,
  };

  const HTTPoisonRequestForm = {
    data() {
      return { tabs: [] };
    },
  };

  const app = Vue.createApp({
    components: {
      BaseInput: BaseInput,
      BaseSelect: BaseSelect,
      BaseInputTable,
      ReqRequestForm,
      HTTPoisonRequestForm,
    },

    template: `
    <div class="app">
      <!-- Info Messages -->
      <div class="box box-warning" v-if="missingDep">
        <p>You must add the following dependency:</p>
        <pre><code>{{ missingDep }}</code></pre>
      </div>
      <form @change="handleFieldChange">
        <div class="container">
          <div class="row header">
            <BaseSelect
              name="request_type"
              label=""
              v-model="fields.request_type"
              selectClass="input input--xs"
              :inline
              :options="requestTypes"
            />

            <BaseInput
              name="variable"
              label=" Assign to "
              type="text"
              v-model="fields.variable"
              inputClass="input input--xs input-text"
              :inline
            />

            <BaseSelect
              name="client"
              label="Using Client "
              v-model="fields.client"
              selectClass="input input--xs"
              :inline
              :options="availableClients"
            />
          </div>

          <div class="common-request-form">
          <div class="row mixed-row">
              <BaseInput
              name="url"
              label="URL"
              type="text"
              v-model="fields.url"
              inputClass="input"
              :grow
              />
          </div>
            <!-- Tabs -->
            <div class="tabs">
                  <div class="tabs-wrapper">
                  <button 
                      type="button"
                      v-for="tab in commonTabs" 
                      :key="tab" 
                      @click="currentTab = tab" 
                      :class="{ active: currentTab === tab }">
                      {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                  </button>
                  <div v-show="clientTabs.length > 0" class="vertical-divider" />
                  <button 
                      type="button"
                      v-for="tab in clientTabs" 
                      :key="tab" 
                      @click="currentTab = tab" 
                      :class="{ active: currentTab === tab }">
                      {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                  </button>
                  </div>
              </div>
            
            <!-- Tab Content -->
            <component :is="currentTabComponent.component"
                 v-bind:modelValue="commonTabs.includes(currentTab)
                 ? fields[currentTab]
                 : fields[fields.client][currentTab]"
                 v-bind:currentTab="currentTab"
                 @update:modelValue="handleFieldChange"
                 v-if="currentTabComponent"></component>
        </div>
      </form>
    </div>
    `,

    data() {
      return {
        fields: info.fields,
        missingDep: info.missing_dep,
        availableClients: [
          { label: "Req", value: "req" },
          { label: "HTTPoison", value: "httpoison" },
        ],
        requestTypes: [
          { label: "GET", value: "get" },
          { label: "POST", value: "post" },
          { label: "PUT", value: "put" },
          { label: "PATCH", value: "patch" },
          { label: "DELETE", value: "delete" },
        ],
        currentTab: "params", // Default active tab
        commonTabs: ["params", "headers"], // Example tabs
        tabComponents: {
          params: {
            component: BaseInputTable,
          },
          headers: {
            component: BaseInputTable,
          },
          req: {
            component: ReqRequestForm,
          },
          httpoison: {
            component: HTTPoisonRequestForm,
          },
        },
      };
    },

    computed: {
      clientTabs() {
        return this.tabComponents[
          this.fields.client.toLowerCase()
        ].component.data().tabs;
      },
      currentTabComponent() {
        const componentConfig =
          this.tabComponents[this.currentTab] ||
          this.tabComponents[this.fields.client];
        if (!componentConfig) return null;

        // Assuming `fields` includes dynamic data that should be passed as props
        const dynamicProps = this.commonTabs.includes(this.currentTab)
          ? this.fields[this.currentTab]
          : this.fields[this.fields.client][this.currentTab];
        console.log(dynamicProps);
        return {
          ...componentConfig,
          modelValue: dynamicProps,
        };
      },
    },

    methods: {
      handleFieldChange(_event) {
        console.log("Event");
        console.log(this.fields);
        ctx.pushEvent("update_fields", JSON.parse(JSON.stringify(this.fields)));
      },
    },
  }).mount(ctx.root);

  ctx.handleEvent("update", ({ fields }) => {
    setValues(fields);
  });

  ctx.handleEvent("missing_dep", ({ dep }) => {
    app.missingDep = dep;
  });

  ctx.handleSync(() => {
    // Synchronously invokes change listeners
    document.activeElement &&
      document.activeElement.dispatchEvent(
        new Event("change", { bubbles: true })
      );
  });

  function setValues(fields) {
    for (const field in fields) {
      app.fields[field] = fields[field];
    }
  }
}