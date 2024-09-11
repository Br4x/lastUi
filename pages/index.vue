<template>
  <div class="flex flex-col items-center justify-between gap-5">
    <Globe />
    <AnimatedBeamExemple />
    <div
      class="relative flex flex-col w-full max-w-[600px] items-center justify-center overflow-hidden rounded-lg border bg-white p-10 md:shadow-xl">

      <span class="text-xl text-left font-bold w-full mb-4">Avatar</span>
      <div class="flex  gap-5">
        <Avatar icon="i-ic-check" />
        <Avatar text="Yo jaxk" />
        <Avatar text="John" />
        <Avatar icon="i-ic-check" badge>
          <template #badge>
            28
          </template>
          <img src="https://vuesax.com/avatars/avatar-3.png" alt="" />
        </Avatar>
        <Avatar icon="i-ic-check" badge>
          <img src="https://vuesax.com/avatars/avatar-3.png" alt="" />
        </Avatar>
        <Avatar icon="i-ic-check" writing history history-gradient badgePosition="bottom-right">
          <img src="https://vuesax.com/avatars/avatar-3.png" alt="" />
        </Avatar>
        <Avatar icon="i-ic-check" writing history history-gradient badgePosition="bottom-right" loading>
          <img src="https://vuesax.com/avatars/avatar-3.png" alt="" />
        </Avatar>
      </div>
      <span class="text-xl text-left font-bold w-full mt-4">Input</span>
      <div class="flex gap-5 w-full items-start">
        <div class="flex flex-col gap-5 w-full  items-start">
          <Input label="Name" v-model="value" placeholder="Simple" />
          <Input v-model="value" label-placeholder="Label placeholder" />
          <Input v-model="value" icon="i-bx-user" label-placeholder="Icon" />
          <Input icon="i-bx-lock-open-alt" type="password" icon-after v-model="value" placeholder="Icon after" />
          <Input v-model="value" icon="i-bx-user" label-placeholder="Loading" loading />
          <div class="mt-8 flex gap-2 items-center">Simple color picker <Input v-model="color" type="color"
              color-picker />
          </div>
        </div>
        <div class="flex flex-col gap-5 w-full  items-start">
          <Input v-model="value" icon="i-bx-user" label-placeholder="Success" state="success"
            hint="Renseigner votre nom" />
          <Input v-model="value" icon="i-bx-user" label-placeholder="Danger" state="danger"
            hint="Renseigner votre nom" />
          <Input v-model="value" icon="i-bx-user" label-placeholder="Warn" state="warn" hint="Renseigner votre nom" />
          <Input v-model="value" icon="i-bx-user" label-placeholder="Progress" :progress="10" />
          <Input v-model="color" label-placeholder="Color" type="color" />
        </div>
      </div>

      <span class="text-xl text-left font-bold w-full mt-4">Range</span>
      <div class="flex gap-5 w-full items-start">
        <div class="flex flex-col gap-5 w-full  items-start">
          <Range label="No step" v-model="range" placeholder="Simple" />
        </div>
        <div class="flex flex-col gap-5 w-full  items-start">
          <Range label="Step" v-model="range" step="5" placeholder="Simple" />
        </div>
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Buttons</span>
      <div class="flex gap-5 w-full items-start">
        <div class="flex flex-col gap-5 w-full  items-start">
          <Button :active="active == 0" @click="active = 0">
            Active
          </Button>
          <div class="button-group flex items-center justify-center">
            <Button :active="active == 1" @click="active = 1">
              Default
            </Button>
            <Button disabled>Disabled</Button>
            <Button loading>loading</Button>
          </div>
          <Button transparent :active="active == 0" @click="active = 0">
            Active
          </Button>
          <Button gradient :active="active == 1" @click="active = 1">
            Default
          </Button>
          <Button gradient disabled>Disabled</Button>
        </div>
        <div class="flex flex-col gap-5 w-full  items-start">
          <Button relief :active="active == 0" @click="active = 0">
            Active
          </Button>
          <Button relief :active="active == 1" @click="active = 1">
            Default
          </Button>
          <Button relief disabled>Disabled</Button>
          <Button upload :active="active == 0" @click="active = 0">
            Active
          </Button>
          <Button gradient style="min-width: 60px" warn animation-type="scale">
            <i class=' i-bxs-shopping-bag' />
            <template #animate>
              Store
            </template>
          </Button>
        </div>
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Checkbox</span>
      <div class="flex gap-5 justify-start  w-full">
        <Checkbox v-model="option" label="Option" />
        <Checkbox v-model="option" label="Option" loading />
        <Checkbox :checked-force="false" />
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Switch</span>
      <div class="flex gap-5 justify-start w-full">
        <Switch v-model="option" label="Option" />
        <Switch v-model="option">
          <template #off>
            Off
          </template>
          <template #on>
            On
          </template>
        </Switch>
        <Switch v-model="option">
          <template #off>
            <i class="i-bxs-volume-mute" />
          </template>
          <template #on>
            <i class="i-bxs-volume-full" />
          </template>
        </Switch>
        <Switch square v-model="option" label="Option" />
        <Switch v-model="option" loading />
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Dialog</span>
      <div class="flex gap-5 justify-start w-full">
        <Button @click="active2 = !active2">
          Open Dialog
        </Button>
        <Dialog v-model="active2">
          <template #header>
            <h4 class="not-margin">
              Welcome to <b>Vuesax</b>
            </h4>
          </template>
          <div class="flex flex-col gap-4 w-full">
            <Input icon="@" placeholder="Email" block />
            <Input icon="i-bxs-lock" type="password" placeholder="Password" block />
            <div class="flex justify-between items-center">
              <Checkbox label="Remember me" />
              <a class="text-xs text-primary underline" href="#">Forgot Password?</a>
            </div>
          </div>
          <template #footer>
            <div class="footer-dialog">
              <Button block>
                Sign In
              </Button>

              <div class="text-sm">
                New Here? <a class="text-xs text-primary underline" href="#">Create New Account</a>
              </div>
            </div>
          </template>
        </Dialog>
        <Button @click="active3 = !active3">
          Open loading Dialog
        </Button>
        <Dialog v-model="active3" loading>
          <template #header>
            <h4 class="not-margin">
              Welcome to <b>Vuesax</b>
            </h4>
          </template>
          <div class="flex flex-col gap-4 w-full">
            <Input icon="@" placeholder="Email" block />
            <Input icon="i-bxs-lock" type="password" placeholder="Password" block />
            <div class="flex justify-between items-center">
              <Checkbox label="Remember me" />
              <a class="text-xs text-primary underline" href="#">Forgot Password?</a>
            </div>
          </div>
          <template #footer>
            <div class="footer-dialog">
              <Button block>
                Sign In
              </Button>

              <div class="text-sm">
                New Here? <a class="text-xs text-primary underline" href="#">Create New Account</a>
              </div>
            </div>
          </template>
        </Dialog>

        <Button @click="showDialog">
          Open Dialog via plugin
        </Button>

        <Button @click="showPrompt">
          Open Prompt via plugin
        </Button>
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Select</span>
      <div class="flex gap-5 justify-start  w-full mb-4">
        <Select v-model="select" :options="options" label="Option" />
        <Select v-model="select2" multiple :options="options" label="Multiple" />
      </div>
      <div class="flex gap-5 justify-start  w-full mb-4">
        <Select v-model="select4" :options="optionsWithGroup" label="With Groups" />
        <Select v-model="select3" multiple :options="optionsWithGroup" label="Multiple With Groups"
          hint="Test message" />
      </div>

      <span class="text-xl text-left font-bold w-full my-4">Tooltip</span>
      <div class="flex gap-5 justify-start  w-full">
        <Tooltip>
          <Button gradient>
            Whats is Vuesax?
          </Button>
          <template #tooltip>
            <div class="content-tooltip">
              <h4 class="text-left font-semibold text-sm">
                Whats is Vuesax?
              </h4>
              <p class="text-left text-sm">
                Vuesax is a framework of UI components created with Vuejs
              </p>
            </div>
          </template>
        </Tooltip>
        <Tooltip bottom shadow not-hover v-model="activeTooltip1">
          <Button danger @click="activeTooltip1 = !activeTooltip1">
            Click Delete User
          </Button>
          <template #tooltip>
            <div class="content-tooltip">
              <h4 class="m-0 p-2 font-semibold">
                Confirm
              </h4>
              <p class="text-left leading-4 m-0 pl-2 pr-0 pt-0 pb-[5px]">
                You are sure to delete this user, by doing so you cannot recover the data
              </p>
              <footer class="flex ">
                <Button @click="activeTooltip1 = false" danger block>
                  Delete
                </Button>
                <Button @click="activeTooltip1 = false" transparent dark block>
                  Cancel
                </Button>
              </footer>
            </div>
          </template>
        </Tooltip>
        <Tooltip shadow interactivity>
          <Avatar>
            <img src="https://vuesax.com/avatars/avatar-5.png">
          </Avatar>
          <template #tooltip>
            <div class="content-tooltip">
              <div class="flex items-start justify-center">
                <div class="flex items-center justify-center flex-col text-[0.55rem] font-normal p-2.5;">
                  Cosed Tasks
                  <span class=" font-bold text-[0.7rem]">
                    89
                  </span>
                </div>
                <Avatar circle size="80"
                  class="mt-[-30px] border-white shadow-[0_4px_15px_0] rounded-full shadow-black/10 border-[3px] border-solid"
                  @click="activeTooltip2 = !activeTooltip2">
                  <img src="https://vuesax.com/avatars/avatar-5.png">
                </Avatar>
                <div class="flex items-center justify-center flex-col text-[0.55rem] font-normal p-2.5;">
                  Open Tasks
                  <span class=" font-bold text-[0.7rem]">
                    8
                  </span>
                </div>
              </div>
              <footer class="flex items-center justify-center">
                <Button circle icon="i-bxs-share-alt" border />
                <Button circle>
                  Message
                </Button>
                <Button icon="i-bx-like" circle border />
              </footer>
            </div>
          </template>
        </Tooltip>

        <div class="p-2 bg-surface rounded-lg text-primary flex flex-col items-center justify-center" v-tip="'Bonjour'">
          Tooltip with
          directive <Button icon="i-bx-like" circle @click="showNotification('top-right')" /></div>
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Notifications</span>
      <div class="flex gap-5 w-full items-start">
        <div class="flex flex-col gap-5 w-full  items-start">
          <Select v-model="notifStyle" :options="styles" label="Style" />
          <Select v-model="variant" :options="variants" label="Variant" />
        </div>
        <div class="flex flex-wrap gap-8 w-full  items-start">
          <Button danger icon="i-bx-border-radius -rotate-90" @click="showNotification('top-left')" />
          <Button warn icon="i-bx-border-top" @click="showNotification('top-center')" />
          <Button success icon="i-bx-border-radius" @click="showNotification('top-right')" />
          <Button warn icon="i-bx-border-radius -rotate-180" @click="showNotification('bottom-left')" />
          <Button warn icon="i-bx-border-bottom" @click="showNotification('bottom-center')" />
          <Button dark icon="i-bx-border-radius rotate-90" @click="showNotification('bottom-right')" />
        </div>
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Paginations</span>
      <div class="flex gap-5 w-full items-start">
        <Pagination :disabled-items="[3, 19]" :loading-items="[2, 20]" v-model="page" :length="20" />
      </div>
      <span class="text-xl text-left font-bold w-full my-4">Table</span>
      <div class="flex gap-5 w-full items-start">
        <Table v-model="selectedUsers" multiple-selection :items="users" :columns="columns" has-selection searchable>
          <template #expand="{ item }">
            <div class="con-content">
              <div>
                <Avatar>
                  <img :src="`https://vuesax.com/avatars/avatar-3.png`" alt="">
                </Avatar>
                <p>
                  {{ item.name }}
                </p>
              </div>
              <div>
                <Button flat icon="i-bx-lock-open-alt" />
                <Button flat icon="i-mynaui-brand-youtube" label="Send Email" />
              </div>
            </div>
          </template>

          <template #name="{ item }">
            <a>{{ item.name }}</a>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column } from '~/types/Table';

const color = ref('')
const value = ref('')
const range = ref(20)
const active = ref(0)
const option = ref(false)
const active2 = ref(false)
const active3 = ref(false)
const activeTooltip1 = ref(false)
const activeTooltip2 = ref(false)
const page = ref(2)
const select = ref('')
const select2 = ref([])
const select3 = ref([])
const select4 = ref([])
const notifStyle = ref('border')
const variant = ref('normal')
const options = [{
  value: 'nike',
  label: 'Nike',
  disabled: true
}, {
  value: 'adidas',
  label: 'Adidas'
}, {
  value: 'PS2',
  label: 'PS2'
}, {
  value: 'golf',
  label: 'Golf'
}, {
  value: 'truc',
  label: 'Truc'
}
]

const optionsWithGroup = {
  "Diversiform": [
    { value: "culture", label: 'Culture-specific' },
    { value: "random", label: 'Culture-random' },
    { value: "state", label: 'State-specific' },
  ],
  "Basic": [
    { value: "heater", label: 'Heater' },
    { value: "spanish", label: 'Spanish' },
    { value: "french", label: 'French' },
  ],
  "Regional": [
    { value: "horsehead", label: 'Horsehead' },
    { value: "horsehead2", label: 'Horsehead Edgy' },
    { value: "polish", label: 'Polish' },
    { value: "hessen", label: 'Hessen' },
    { value: "swiss", label: 'Swiss' },
  ],
  "Historical": [
    { value: "boeotian", label: 'Boeotian' },
    { value: "roman", label: 'Roman' },
    { value: "kite", label: 'Kite' },
    { value: "oldFrench", label: 'Old French' },
    { value: "renaissance", label: 'Renaissance' },
    { value: "baroque", label: 'Baroque' },
  ],
  "Specific": [
    { value: "targe", label: 'Targe' },
    { value: "targe2", label: 'Targe2' },
    { value: "pavise", label: 'Pavise' },
    { value: "wedged", label: 'Wedged' },
  ],
  "Banner": [
    { value: "flag", label: 'Flag' },
    { value: "pennon", label: 'Pennon' },
    { value: "guidon", label: 'Guidon' },
    { value: "banner", label: 'Banner' },
    { value: "dovetail", label: 'Dovetail' },
    { value: "gonfalon", label: 'Gonfalon' },
    { value: "pennant", label: 'Pennant' },
  ]
}

const styles = [{
  value: 'border',
  label: 'Border',
}, {
  value: 'flat',
  label: 'Flat'
}, {
  value: 'square',
  label: 'Squared'
}
]

const variants = [{
  value: 'normal',
  label: 'Normal',
}, {
  value: 'success',
  label: 'Success'
}, {
  value: 'error',
  label: 'Error'
}, {
  value: 'warning',
  label: 'Warning'
}
]

const selectedUsers = ref([])

const columns = [
  {
    label: 'Id',
    key: 'id',
  },
  {
    label: 'Nom',
    key: 'name',
    sortable: true
  },
  {
    label: 'Pseudo',
    key: 'username',
    sortable: true
  },
  {
    label: 'Email',
    key: 'email',
    sortable: true
  }] as Column[]

const users = [
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "website": "hildegard.org",
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "website": "anastasia.net",
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "website": "ramiro.info",
  },
  {
    "id": 4,
    "name": "Patricia Lebsack",
    "username": "Karianne",
    "email": "Julianne.OConner@kory.org",
    "website": "kale.biz",
  },
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "username": "Kamren",
    "email": "Lucio_Hettinger@annie.ca",
    "website": "demarco.info",
  },
  {
    "id": 6,
    "name": "Mrs. Dennis Schulist",
    "username": "Leopoldo_Corkery",
    "email": "Karley_Dach@jasper.info",
    "website": "ola.org",
  },
  {
    "id": 7,
    "name": "Kurtis Weissnat",
    "username": "Elwyn.Skiles",
    "email": "Telly.Hoeger@billy.biz",
    "website": "elvis.io",
  },
  {
    "id": 8,
    "name": "Nicholas Runolfsdottir V",
    "username": "Maxime_Nienow",
    "email": "Sherwood@rosamond.me",
    "website": "jacynthe.com",
  },
  {
    "id": 9,
    "name": "Glenna Reichert",
    "username": "Delphine",
    "email": "Chaim_McDermott@dana.io",
    "website": "conrad.com",
  },
  {
    "id": 10,
    "name": "Clementina DuBuque",
    "username": "Moriah.Stanton",
    "email": "Rey.Padberg@karina.biz",
    "website": "ambrose.net",
  },
  {
    "id": 11,
    "name": "Jean claudus",
    "username": "Jean.Claudus",
    "email": "jclaudus@karina.biz",
    "website": "claudus.net",
  }
]
const { $notification, $dialog, $prompt } = useNuxtApp()
function showNotification(position: any) {
  $notification({
    title: 'Hello!',
    text: 'These documents refer to the latest version of vuesax (4.0+), to see the documents of the previous versions you can do it here ',
    icon: 'i-ic-baseline-check',
    border: notifStyle.value === 'border',
    square: notifStyle.value === 'square',
    flat: notifStyle.value === 'flat',
    variant: !variant.value || variant.value === 'normal' ? 'primary' : variant.value,
    position,
    duration: 3000
  })
}

function showDialog() {
  $dialog({
    resizable: false,
    title: "Generate new map",
    body: `Are you sure you want to generate a new map?<br />
    All unsaved changes made to the current map will be lost`,
    buttons: {
      Generate: () => {
        console.log('generate')
      },
      Cancel: () => {

      },

    }
  });
}

function showPrompt() {
  $prompt(
    `Put an number and see it appears in log`,
    { default: 'lol' },
    (value) => {
      console.log('value :', value)
    }
  );
}

</script>