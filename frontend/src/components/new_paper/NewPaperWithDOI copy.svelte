<script lang="ts">
    import TextValue from "../form_elems/TextValue.svelte";
    import Button from "@smui/button";
    import RelevantText from "./OperationField.svelte";
    import Tag from "./Tag.svelte";
    import * as data from "../../data";
    let doi: string;
    export let relevantTexts: { text: string; focus: boolean; elem: any }[] = [
      { text: "", focus: false, elem: null },
    ];
    export let tags: string[] = [""];
    let keyRelevantTexts = 0;
    let keyTags = 0;
    let errorMsg = "";
    let analysisText = { text: "", focus: false, elem: null };
    function save() {
      const jsonData = {
        doi: doi,
        relevant_text: relevantTexts.map((x) => x.text),
        tags: tags.filter((x) => x !== ""),
        analysis: analysisText.text
      };
      console.log("json data: ", jsonData);
      // Check if doi is not empty
      const check = data.checkField(jsonData);
      if (check.error === false) {
        // Make a cross-origin request to backend
        fetch(`http://localhost:${data.PORT}/`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData)
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            errorMsg = data.result;
            setTimeout(() => {
              errorMsg = "";
            }, 5000);
          })
          .catch((error) => {
            console.error("Error:", error);
            // If error show error message in frontend during 5 seconds
            errorMsg = "Error: " + error;
            setTimeout(() => {
              errorMsg = "";
            }, 5000);
          });
      } else {
        // If error show error message in frontend during 5 seconds
        errorMsg = "Error: " + check.message;
        setTimeout(() => {
          errorMsg = "";
        }, 5000);
      }
      const buttons = document.querySelectorAll("button");
      buttons[buttons.length - 1].focus();
    }
  </script>
  
  <!-- Following fields are required: doi, relevant texts (add function possible), tags (function add possible) -->
  <div class="main">
    <h1>New Paper</h1>
    <Button
      style="width:100%; margin-bottom:2em;"
      variant="raised"
      on:click={() => {
        // Make a delete request to backend
        fetch(`http://localhost:${data.PORT}/clean/`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            errorMsg = "Deleted all papers";
            setTimeout(() => {
              errorMsg = "";
            }, 5000);
            // Clear fields
            // doi = "";
            // relevantTexts = [{ text: "", focus: false, elem: null }];
            // tags = [""];
          })
          .catch((error) => {
            console.error("Error:", error);
            // If error show error message in frontend during 5 seconds
            errorMsg = "Error: " + error;
            setTimeout(() => {
              errorMsg = "";
            }, 5000);
          });
      }}>Clear all papers</Button
    >
    <div class="form">
      <TextValue
        label="DOI"
        style="width: 100%;"
        bind:value={doi}
        focused={true}
      />
      {#key keyRelevantTexts}
        {#each relevantTexts as { text, focus, elem }, i (i)}
          <!-- Bind text to relevantTexts[i] in RelevantText.svelte -->
          <RelevantText
            bind:text={relevantTexts[i].text}
            index={i}
            on:remove={(i) => {
              console.log("remove relevant text ", i.detail.index);
              relevantTexts.splice(i.detail.index, 1);
              keyRelevantTexts += 1;
            }}
            className="relevant-text"
          />
        {/each}
      {/key}
      <Button
        style="width:100%"
        on:click={() => {
          console.log("add relevant text ", relevantTexts);
          keyRelevantTexts += 1;
          relevantTexts.push({ text: "", focus: true, elem: null });
          // Focus on last element after 100ms
          setTimeout(() => {
            document
              .querySelectorAll("textarea")
              [relevantTexts.length - 1].focus();
          }, 100);
        }}
        variant="raised">Add Relevant Text</Button
      >
      {#key keyTags}
        {#each tags as tag, i (i)}
          <Tag
            bind:text={tags[i]}
            index={i}
            on:remove={(v) => {
              tags.splice(i, 1);
              keyTags += 1;
            }}
          />
        {/each}
      {/key}
      <Button
        style="width:100%"
        on:click={() => {
          console.log("add tag ", tags);
          keyTags += 1;
          tags.push("");
          // Focus on last element after 100ms
          setTimeout(() => {
            console.log("selecting input ", tags.length, document.querySelectorAll("input"));
            const inputs = document.querySelectorAll("input");
            document.querySelectorAll("input")[inputs.length-2].focus();
          }, 200);
        }}
        variant="raised">Add Tag</Button
      >
      <RelevantText 
      bind:text={analysisText.text}
      index={-1}
      className="relevant-text"
      label="Comment?"
      style="margin-top:2em;"
      bind:this={analysisText.elem}/>
      <Button style="width:100%; margin-top:2em;" variant="raised" on:click={save}
        >Save</Button
      >
      <Button style="width:100%; margin-top:2em;" variant="raised" on:click={()=> {
        doi = "";
        relevantTexts = [{ text: "", focus: false, elem: null }];
        tags = [""];
        analysisText.text = "";
        // Focus doi field input
        setTimeout(() => {
          document.querySelectorAll("input")[0].focus();
        }, 100);
      }}
        >Clear</Button
      >
      {#if errorMsg !== ""}
        <p style="color:red;">{errorMsg}</p>
      {/if}
      <span style="margin-top: 10vh"></span>
    </div>
  </div>
  
  <style>
    h1 {
      color: grey;
    }
    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .main {
      margin: 2em;
      width: calc(100%-2em);
    }
    .form {
      width: 100%;
    }
  </style>
  