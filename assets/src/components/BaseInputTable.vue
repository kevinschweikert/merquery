<script>
import BaseSwitch from './BaseSwitch.vue'
import BaseSecret from './BaseSecret.vue'

export default {
    name: "BaseInputTable",
    components: {
        BaseSwitch,
        BaseSecret
    },
    props: {
        ctx: Object,
        modelValue: Array,
        currentTab: String,
        bindingOptions: Array
    },
    data() {
        return {
            addRow: { active: true, key: "", value: "", type: 0 },
            focusedRowIndex: null,
            inputs: {},
        };
    },
    computed: {
        newRowIndex() {
            return this.modelValue.length;
        }
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
                    type: 0,
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
    }
};
</script>

<template>
    <div class="w-full">
        <table class="w-full text-left border-collapse mt-4 h-60">
            <thead class="flex w-full">
                <tr class="w-full flex">
                    <th class="pl-16 py-2 px-3 border-b border-gray-200 text-gray-800 bg-gray-50"></th>
                    <th class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-800 bg-gray-50">Key</th>
                    <th class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-800 bg-gray-50">Value</th>
                </tr>
            </thead>
            <tbody class="flex w-full flex-col overflow-y-auto h-full">
                <tr v-for="(row, index) in modelValue" :key="index" class="w-full table-row relative">
                    <td class="py-2 px-3 border-b border-gray-200 text-gray-600">
                        <BaseSwitch v-model="row.active" />
                    </td>
                    <td class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-600">
                        <input type="text" v-model="row.key" placeholder="Key"
                            :ref="(el) => { inputs['key-' + index] = el; }"
                            @input="handleInput(index, 'key', $event.target.value)" @focus="handleFocus(index)"
                            @blur="handleFocus(index)"
                            class="py-2 px-3 mr-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-50 w-full focus:outline-none">
                    </td>
                    <td class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-600">
                        <BaseSecret :ctx="ctx" :ref="(el) => { inputs['value-' + index] = el; }" textInputName="value"
                            secretInputName="value" toggleInputName="type" label="" v-model:textInputValue="row.value"
                            v-model:secretInputValue="row.value" v-model:bindingInputValue="row.value"
                            v-model:toggleInputValue="row.type" modalTitle="Set Value" @focus="handleFocus(index)"
                            :bindingOptions="bindingOptions" @blur="handleBlur(index)" />
                        <!-- Apply conditional rendering for the delete icon -->
                        <span v-show="focusedRowIndex !== index" class="delete-icon" @click="deleteRow(index)">
                            &#10006; <!-- Simple 'X' icon, can be replaced with an SVG or Font Awesome icon -->
                        </span>
                    </td>
                </tr>
                <tr id="newRow" :key="newRowIndex" class="w-full table-row relative">
                    <td class="py-2 px-3 border-b border-gray-200 text-gray-600">
                        <BaseSwitch v-model="addRow.active" />
                    </td>
                    <td class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-600">
                        <input type="text" v-model="addRow.key" placeholder="Key"
                            @input="handleInput(newRowIndex, 'key', $event.target.value)"
                            @focus="handleFocus(newRowIndex)" @blur="handleFocus(newRowIndex)"
                            class="py-2 px-3 mr-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-50 w-full focus:outline-none">
                    </td>
                    <td class="w-1/2 py-2 px-3 border-b border-gray-200 text-gray-600">
                        <BaseSecret :ctx="ctx" textInputName="value" secretInputName="value" toggleInputName="type"
                            label="" v-model:textInputValue="addRow.value" v-model:secretInputValue="addRow.value"
                            v-model:toggleInputValue="addRow.type" :bindingOptions="bindingOptions"
                            v-model:bindingInputValue="addRow.value" modalTitle="Set value"
                            @focus="handleFocus(newRowIndex)" @blur="handleBlur(newRowIndex)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>