// ===== CONFIGURATION =====
const CONFIG = {
    apiKey: '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',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    model: 'deepseek-ai/deepseek-v4-pro',
    maxTokens: 16384,
    temperature: 0.8,
};

// ===== STATE =====
let state = {
    messages: [],
    isLoading: false,
    messageCount: 0,
    tokenCount: 0,
    codeMode: false,
    lastAiMessage: '',
};

// ===== GAME CONTEXTS =====
const GAME_CONTEXTS = {
    skyrim: {
        name: 'The Elder Scrolls V: Skyrim',
        tools: ['Creation Kit', 'xEdit', 'Wrye Bash', 'FNIS', 'SSEEdit'],
        languages: ['Papyrus', 'JSON', 'XML'],
        resources: 'Nexus Mods, UESP Wiki, Creation Kit Wiki',
    },
    minecraft: {
        name: 'Minecraft',
        tools: ['Minecraft Forge', 'Fabric', 'MCreator', 'BlockBench'],
        languages: ['Java', 'JSON', 'Python (Scripts)'],
        resources: 'CurseForge, Modrinth, MC Wiki',
    },
    fallout4: {
        name: 'Fallout 4',
        tools: ['Creation Kit', 'xEdit', 'Wrye Flash', 'FOMOD Creator'],
        languages: ['Papyrus', 'JSON', 'XML'],
        resources: 'Nexus Mods, Fallout Wiki',
    },
    gta5: {
        name: 'GTA V',
        tools: ['OpenIV', 'RAGE Plugin Hook', 'Script Hook V', 'CodeWalker'],
        languages: ['C++', 'C#', 'Lua'],
        resources: 'GTA5-Mods.com, FiveM Docs',
    },
    stardew: {
        name: 'Stardew Valley',
        tools: ['SMAPI', 'Content Patcher', 'PyTK', 'ModDrop'],
        languages: ['C#', 'JSON'],
        resources: 'Nexus Mods, Stardew Valley Wiki, SMAPI Docs',
    },
    witcher3: {
        name: 'The Witcher 3',
        tools: ['WolvenKit', 'Modkit', 'Blender avec plugin W3'],
        languages: ['WitcherScript', 'XML', 'JSON'],
        resources: 'Nexus Mods, Witcher Wiki',
    },
    cyberpunk: {
        name: 'Cyberpunk 2077',
        tools: ['WolvenKit', 'Cyber Engine Tweaks', 'ArchiveXL'],
        languages: ['Lua', 'TypeScript', 'JSON', 'Redscript'],
        resources: 'Nexus Mods, Cyberpunk 2077 Wiki',
    },
    rimworld: {
        name: 'RimWorld',
        tools: ['RimWorld Dev Tools', 'XML Editor'],
        languages: ['XML', 'C#', 'Python'],
        resources: 'Ludeon Forums, RimWorld Wiki, Steam Workshop',
    },
    factorio: {
        name: 'Factorio',
        tools: ['VSCode avec plugin Factorio', 'Factorio Mod Portal'],
        languages: ['Lua'],
        resources: 'Factorio Wiki, Factorio Mod Portal, forums.factorio.com',
    },
    autre: {
        name: 'Général / Autre jeu',
        tools: ['Divers selon le jeu'],
        languages: ['Dépend du moteur'],
        resources: 'Documentation officielle du jeu',
    },
};

// ===== TEMPLATES =====
const TEMPLATES = {
    'skyrim-spell': {
        title: 'Sort Skyrim - Papyrus',
        language: 'papyrus',
        code: `Scriptname MyNewSpell extends ActiveMagicEffect

; ===== PROPRIÉTÉS =====
; Configurez ces propriétés dans le Creation Kit

; Effets visuels
VisualEffect Property MySpellVFX Auto
Sound Property MySpellSound Auto

; Dommages / Effets
float Property SpellDamage = 25.0 Auto
float Property SpellDuration = 3.0 Auto
bool Property IsAreaEffect = false Auto

; ===== ÉVÉNEMENTS =====
Event OnEffectStart(Actor akTarget, Actor akCaster)
    ; Déclenché quand le sort commence
    Debug.Notification("Sort activé sur " + akTarget.GetDisplayName())
    
    ; Jouer le son
    if MySpellSound
        MySpellSound.Play(akTarget)
    endif
    
    ; Jouer l'effet visuel
    if MySpellVFX
        MySpellVFX.Play(akTarget)
    endif
    
    ; Appliquer les dommages
    akTarget.DamageActorValue("Health", SpellDamage)
    
    ; Effet de zone (si activé)
    if IsAreaEffect
        ApplyAreaEffect(akTarget, akCaster)
    endif
EndEvent

Event OnEffectFinish(Actor akTarget, Actor akCaster)
    ; Déclenché quand l'effet se termine
    Debug.Notification("Sort terminé")
    
    ; Nettoyer les effets visuels
    if MySpellVFX
        MySpellVFX.Stop(akTarget)
    endif
EndEvent

; ===== FONCTIONS PERSONNALISÉES =====
Function ApplyAreaEffect(Actor akTarget, Actor akCaster)
    ; Exemple: toucher tous les ennemis dans un rayon de 10 unités
    Actor[] nearbyActors = akTarget.GetLinkedRef().GetActorValue("Health") as Actor[]
    ; Note: Utilisez FindAllReferencesOfType pour une vraie implémentation
    Debug.Trace("Effet de zone appliqué autour de " + akTarget.GetDisplayName())
EndFunction

; Fonction utilitaire pour vérifier si la cible est hostile
bool Function IsHostile(Actor akActor)
    return akActor.IsHostileToActor(Game.GetPlayer())
EndFunction`,
    },
    'mc-item': {
        title: 'Item Minecraft Forge - Java',
        language: 'java',
        code: `package com.monmod.items;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Tier;
import net.minecraft.world.item.SwordItem;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.InteractionHand;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

/**
 * Classe principale de l'item personnalisé
 * Exemple: Une épée légendaire avec des effets spéciaux
 */
public class LegendarySword extends SwordItem {
    
    // Statistiques de l'item
    private static final int ATTACK_DAMAGE = 10;
    private static final float ATTACK_SPEED = -2.0F;
    private static final int MAX_DURABILITY = 2000;
    
    public LegendarySword(Tier tier) {
        super(tier, ATTACK_DAMAGE, ATTACK_SPEED, 
            new Item.Properties()
                .stacksTo(1)
                .durability(MAX_DURABILITY)
                .fireResistant()
        );
    }
    
    /**
     * Action au clic droit
     */
    @Override
    public InteractionResultHolder<ItemStack> use(
            Level level, 
            Player player, 
            InteractionHand hand) {
        
        ItemStack stack = player.getItemInHand(hand);
        
        if (!level.isClientSide()) {
            // Effet spécial: régénération temporaire
            player.addEffect(new MobEffectInstance(
                MobEffects.REGENERATION, 200, 1
            ));
            
            // Son épique
            level.playSound(null, 
                player.getX(), player.getY(), player.getZ(),
                SoundEvents.TRIDENT_THUNDER,
                SoundSource.PLAYERS,
                1.0F, 1.0F
            );
            
            // Réduire la durabilité
            stack.hurtAndBreak(1, player, 
                p -> p.broadcastBreakEvent(hand)
            );
        }
        
        return InteractionResultHolder.sidedSuccess(stack, level.isClientSide());
    }
    
    /**
     * Vérifier si l'item peut être enchanté
     */
    @Override
    public int getEnchantmentValue() {
        return 20; // Haute enchantabilité
    }
    
    /**
     * Tooltip personnalisé
     */
    @Override
    public void appendHoverText(
            ItemStack stack,
            @Nullable Level level,
            List<Component> tooltip,
            TooltipFlag flag) {
        
        tooltip.add(Component.literal("⚔ Épée Légendaire")
            .withStyle(ChatFormatting.GOLD));
        tooltip.add(Component.literal("Forgée dans les flammes du dragon")
            .withStyle(ChatFormatting.GRAY));
        tooltip.add(Component.literal("Clic droit: Régénération temporaire")
            .withStyle(ChatFormatting.AQUA));
    }
}

// ===== REGISTRATION =====
// Dans votre classe principale du mod:
/*
public static final DeferredRegister<Item> ITEMS = 
    DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

public static final RegistryObject<Item> LEGENDARY_SWORD = 
    ITEMS.register("legendary_sword",
        () -> new LegendarySword(Tiers.NETHERITE)
    );
*/`,
    },
    'stardew-smapi': {
        title: 'Mod SMAPI - Stardew Valley',
        language: 'csharp',
        code: `using StardewModdingAPI;
using StardewModdingAPI.Events;
using StardewValley;
using StardewValley.TerrainFeatures;
using Microsoft.Xna.Framework;

namespace MonMod
{
    /// <summary>
    /// Classe principale du mod SMAPI
    /// Modifiez les éléments marqués TODO
    /// </summary>
    public class ModEntry : Mod
    {
        // Configuration du mod
        private ModConfig Config;
        
        // ===== ENTRÉE PRINCIPALE =====
        public override void Entry(IModHelper helper)
        {
            // Charger la configuration
            this.Config = helper.ReadConfig<ModConfig>();
            
            // Enregistrer les événements
            helper.Events.GameLoop.GameLaunched += OnGameLaunched;
            helper.Events.GameLoop.DayStarted += OnDayStarted;
            helper.Events.GameLoop.DayEnding += OnDayEnding;
            helper.Events.Input.ButtonPressed += OnButtonPressed;
            helper.Events.Player.InventoryChanged += OnInventoryChanged;
            helper.Events.World.NpcListChanged += OnNpcListChanged;
            
            // Log de démarrage
            this.Monitor.Log("MonMod est chargé ! 🌟", LogLevel.Info);
        }
        
        // ===== ÉVÉNEMENTS =====
        
        private void OnGameLaunched(object sender, GameLaunchedEventArgs e)
        {
            // TODO: Initialiser les éléments qui nécessitent que le jeu soit chargé
            // Ex: Enregistrer avec d'autres mods (Content Patcher, etc.)
            
            // Exemple: Compatibilité avec Generic Mod Config Menu
            var configMenu = this.Helper.ModRegistry
                .GetApi<IGenericModConfigMenuApi>("spacechase0.GenericModConfigMenu");
            
            if (configMenu != null)
            {
                configMenu.Register(
                    mod: this.ModManifest,
                    reset: () => this.Config = new ModConfig(),
                    save: () => this.Helper.WriteConfig(this.Config)
                );
                
                configMenu.AddBoolOption(
                    mod: this.ModManifest,
                    name: () => "Activer la fonctionnalité",
                    getValue: () => this.Config.EnableFeature,
                    setValue: value => this.Config.EnableFeature = value
                );
            }
        }
        
        private void OnDayStarted(object sender, DayStartedEventArgs e)
        {
            // TODO: Actions au début de chaque journée
            if (!Context.IsWorldReady) return;
            
            this.Monitor.Log($"Jour {Game1.dayOfMonth} commencé !", LogLevel.Debug);
            
            // Exemple: Donner un item au joueur chaque lundi
            if (Game1.dayOfMonth % 7 == 1 && this.Config.EnableFeature)
            {
                GivePlayerItem(SObject.wood, 50);
                Game1.addHUDMessage(
                    new HUDMessage("Cadeau de début de semaine reçu !", HUDMessage.achievement_type)
                );
            }
        }
        
        private void OnDayEnding(object sender, DayEndingEventArgs e)
        {
            // TODO: Actions à la fin de la journée (avant la sauvegarde)
            this.Monitor.Log("Journée terminée, sauvegarde en cours...", LogLevel.Debug);
        }
        
        private void OnButtonPressed(object sender, ButtonPressedEventArgs e)
        {
            if (!Context.IsWorldReady) return;
            
            // TODO: Changer la touche dans la config
            if (e.Button == this.Config.ActivationKey)
            {
                ActivateSpecialFeature();
            }
        }
        
        private void OnInventoryChanged(object sender, InventoryChangedEventArgs e)
        {
            // Exemple: Détecter quand le joueur ramasse un item spécifique
            foreach (Item item in e.Added)
            {
                if (item?.ParentSheetIndex == 60) // Diamond (exemple)
                {
                    Game1.addHUDMessage(
                        new HUDMessage("Vous avez trouvé un diamant ! 💎", 1)
                    );
                }
            }
        }
        
        private void OnNpcListChanged(object sender, NpcListChangedEventArgs e)
        {
            // Exemple: Détecter l'apparition d'un PNJ
            foreach (NPC npc in e.Added)
            {
                this.Monitor.Log($"NPC apparu: {npc.Name}", LogLevel.Debug);
            }
        }
        
        // ===== FONCTIONS UTILITAIRES =====
        
        private void GivePlayerItem(int itemId, int quantity = 1)
        {
            try
            {
                SObject obj = new SObject(itemId, quantity);
                Game1.player.addItemByMenuIfNecessary(obj);
            }
            catch (Exception ex)
            {
                this.Monitor.Log($"Erreur ajout item: {ex.Message}", LogLevel.Error);
            }
        }
        
        private void ActivateSpecialFeature()
        {
            // TODO: Implémenter votre fonctionnalité spéciale
            this.Monitor.Log("Fonctionnalité spéciale activée !", LogLevel.Info);
            Game1.addHUDMessage(new HUDMessage("Fonctionnalité activée ! ✨", 1));
        }
    }
    
    // ===== CONFIGURATION =====
    public class ModConfig
    {
        public bool EnableFeature { get; set; } = true;
        public SButton ActivationKey { get; set; } = SButton.F5;
        public int BonusAmount { get; set; } = 100;
        // TODO: Ajoutez vos options de configuration ici
    }
}`,
    },
    'factorio-building': {
        title: 'Bâtiment Factorio - Lua',
        language: 'lua',
        code: `-- ===== NOUVEAU BÂTIMENT FACTORIO =====
-- Fichier: prototypes/entity.lua
-- Chargé depuis data.lua: require("prototypes/entity")

local mon_batiment = {
    -- Type d'entité Factorio
    type = "assembling-machine",
    name = "mon-super-batiment",
    
    -- Textes localisés (définis dans locale/fr.cfg)
    localised_name = {"entity-name.mon-super-batiment"},
    localised_description = {"entity-description.mon-super-batiment"},
    
    -- Icône
    icon = "__mon-mod__/graphics/icons/mon-batiment.png",
    icon_size = 64,
    
    -- Flags
    flags = {"placeable-neutral", "placeable-player", "player-creation"},
    
    -- Propriétés physiques
    minable = {
        mining_time = 0.5,
        result = "mon-super-batiment"
    },
    max_health = 300,
    
    -- Résistances
    resistances = {
        {type = "fire", percent = 70},
        {type = "impact", percent = 30}
    },
    
    -- Collision
    collision_box = {{-1.4, -1.4}, {1.4, 1.4}},
    selection_box = {{-1.5, -1.5}, {1.5, 1.5}},
    
    -- Vitesse de fabrication (1 = normal, 2 = double)
    crafting_speed = 2,
    
    -- Catégories de recettes supportées
    crafting_categories = {"crafting", "advanced-crafting", "mon-categorie"},
    
    -- Consommation d'énergie
    energy_source = {
        type = "electric",
        usage_priority = "secondary-input",
        emissions_per_minute = 5
    },
    energy_usage = "150kW",
    
    -- Inventaire
    ingredient_count = 6,
    module_specification = {
        module_slots = 4
    },
    
    -- Graphiques
    graphics_set = {
        animation = {
            layers = {
                {
                    filename = "__mon-mod__/graphics/entity/mon-batiment/mon-batiment.png",
                    priority = "high",
                    width = 214,
                    height = 230,
                    frame_count = 32,
                    animation_speed = 0.5,
                    shift = util.by_pixel(0, -7),
                    scale = 0.5
                },
                -- Couche de lumière
                {
                    filename = "__mon-mod__/graphics/entity/mon-batiment/mon-batiment-light.png",
                    priority = "high",
                    width = 214,
                    height = 230,
                    frame_count = 32,
                    animation_speed = 0.5,
                    draw_as_light = true,
                    blend_mode = "additive",
                    shift = util.by_pixel(0, -7),
                    scale = 0.5
                }
            }
        }
    },
    
    -- Connexion de fluide (optionnel)
    fluid_boxes = {
        {
            production_type = "input",
            pipe_picture = assembler2pipepictures(),
            pipe_covers = pipecoverspictures(),
            base_area = 10,
            base_level = -1,
            pipe_connections = {{type = "input", position = {0, -2}}}
        },
        {
            production_type = "output",
            pipe_picture = assembler2pipepictures(),
            pipe_covers = pipecoverspictures(),
            base_area = 10,
            base_level = 1,
            pipe_connections = {{type = "output", position = {0, 2}}}
        }
    },
    
    -- Sons
    open_sound = {filename = "__base__/sound/machine-open.ogg", volume = 0.85},
    close_sound = {filename = "__base__/sound/machine-close.ogg", volume = 0.75},
    working_sound = {
        sound = {
            filename = "__base__/sound/assembling-machine-t1-1.ogg",
            volume = 0.5
        },
        idle_sound_volume = 0.6,
        activate_sound = {filename = "__base__/sound/assembling-machine-t1-2.ogg", volume = 0.5}
    }
}

-- ===== RECETTE DU BÂTIMENT =====
local recette_batiment = {
    type = "recipe",
    name = "mon-super-batiment",
    enabled = false, -- Nécessite une technologie
    
    ingredients = {
        {"iron-plate", 20},
        {"copper-plate", 15},
        {"electronic-circuit", 10},
        {"steel-plate", 5}
    },
    
    result = "mon-super-batiment",
    energy_required = 5
}

-- ===== ITEM DU BÂTIMENT =====
local item_batiment = {
    type = "item",
    name = "mon-super-batiment",
    icon = "__mon-mod__/graphics/icons/mon-batiment.png",
    icon_size = 64,
    subgroup = "production-machine",
    order = "z[mon-super-batiment]",
    place_result = "mon-super-batiment",
    stack_size = 10
}

-- ===== TECHNOLOGIE =====
local tech_batiment = {
    type = "technology",
    name = "mon-super-batiment-tech",
    icon = "__mon-mod__/graphics/technology/mon-tech.png",
    icon_size = 256,
    
    prerequisites = {"electronics", "steel-processing"},
    
    unit = {
        count = 150,
        ingredients = {
            {"automation-science-pack", 1},
            {"logistic-science-pack", 1}
        },
        time = 30
    },
    
    effects = {
        {type = "unlock-recipe", recipe = "mon-super-batiment"}
    }
}

-- Enregistrer tous les prototypes
data:extend({mon_batiment, recette_batiment, item_batiment, tech_batiment})

-- ===== SCRIPT DE CONTRÔLE (control.lua) =====
--[[
script.on_event(defines.events.on_built_entity, function(event)
    local entity = event.created_entity
    if entity.name == "mon-super-batiment" then
        game.print("Bâtiment construit ! Position: " .. 
            entity.position.x .. ", " .. entity.position.y)
    end
end)

script.on_event(defines.events.on_tick, function(event)
    -- Logique chaque tick (éviter les calculs lourds ici)
    if event.tick % 60 == 0 then -- Chaque seconde
        -- Votre logique ici
    end
end)
]]`,
    },
    'gta-asi': {
        title: 'Script ASI GTA V - C++',
        language: 'cpp',
        code: `// ===== SCRIPT ASI GTA V =====
// Nécessite: Script Hook V SDK
// Compilateur: Visual Studio 2022
// Lien: http://www.dev-c.com/gtav/scripthookv/

#include "script.h"
#include "natives.h"
#include "keyboard.h"
#include <string>
#include <vector>

// ===== CONFIGURATION =====
#define MOD_NAME "Mon Super Mod"
#define MOD_VERSION "1.0.0"
#define ACTIVATION_KEY VK_F6

// ===== VARIABLES GLOBALES =====
bool modEnabled = false;
bool menuOpen = false;
int menuIndex = 0;
float menuX = 0.02f, menuY = 0.02f;

// Paramètres du mod
float godModeMultiplier = 0.0f;
bool noclipEnabled = false;
float noclipSpeed = 2.0f;

// ===== DÉCLARATIONS =====
void ShowSubtitle(const char* text, int duration = 2000);
void DrawString(const char* text, float x, float y, float scale, int r, int g, int b, int a);
void DrawRect(float x, float y, float w, float h, int r, int g, int b, int a);
void DrawMenu();
void HandleNoclip();
void UpdateMod();

// ===== FONCTIONS UTILITAIRES =====

void ShowSubtitle(const char* text, int duration) {
    UI::_SET_TEXT_ENTRY_2("STRING");
    UI::_ADD_TEXT_COMPONENT_STRING((char*)text);
    UI::_DRAW_SUBTITLE_TIMED(duration, 1);
}

void DrawString(const char* text, float x, float y, float scale, int r, int g, int b, int a) {
    UI::SET_TEXT_FONT(0);
    UI::SET_TEXT_SCALE(scale, scale);
    UI::SET_TEXT_COLOUR(r, g, b, a);
    UI::SET_TEXT_WRAP(0.0, 1.0);
    UI::SET_TEXT_LEFT_JUSTIFY(1);
    UI::SET_TEXT_DROPSHADOW(2, 0, 0, 0, 255);
    
    UI::SET_TEXT_ENTRY("STRING");
    UI::_ADD_TEXT_COMPONENT_STRING((char*)text);
    UI::DRAW_TEXT(x, y);
}

// ===== MENU PRINCIPAL =====

struct MenuItem {
    std::string name;
    bool* toggle;
    std::function<void()> action;
};

std::vector<MenuItem> menuItems = {
    {"Invincibilité", nullptr, []() {
        Ped player = PLAYER::PLAYER_PED_ID();
        ENTITY::SET_ENTITY_INVINCIBLE(player, true);
        ShowSubtitle("Invincibilité activée");
    }},
    {"Wanted Level 0", nullptr, []() {
        PLAYER::CLEAR_PLAYER_WANTED_LEVEL(PLAYER::PLAYER_ID());
        PLAYER::SET_MAX_WANTED_LEVEL(0);
        ShowSubtitle("Recherché supprimé");
    }},
    {"Téléport waypoint", nullptr, []() {
        if (UI::IS_WAYPOINT_ACTIVE()) {
            Vector3 waypointPos = UI::GET_BLIP_COORDS(UI::GET_FIRST_BLIP_INFO_ID(8));
            float groundZ;
            GAMEPLAY::GET_GROUND_Z_FOR_3D_COORD(
                waypointPos.x, waypointPos.y, 1000.0f, &groundZ, false
            );
            Ped player = PLAYER::PLAYER_PED_ID();
            ENTITY::SET_ENTITY_COORDS(player, 
                waypointPos.x, waypointPos.y, groundZ + 1.0f, false, false, false, false
            );
            ShowSubtitle("Téléporté au waypoint !");
        } else {
            ShowSubtitle("Placez d'abord un waypoint !");
        }
    }},
    {"Spawn Zentorno", nullptr, []() {
        Vector3 pos = ENTITY::GET_ENTITY_COORDS(PLAYER::PLAYER_PED_ID(), true);
        Hash hash = GAMEPLAY::GET_HASH_KEY("ZENTORNO");
        STREAMING::REQUEST_MODEL(hash);
        
        DWORD endTime = GetTickCount() + 2000;
        while (!STREAMING::HAS_MODEL_LOADED(hash) && GetTickCount() < endTime) {
            WAIT(0);
        }
        
        Vehicle veh = VEHICLE::CREATE_VEHICLE(
            hash, pos.x + 3.0f, pos.y, pos.z, 
            ENTITY::GET_ENTITY_HEADING(PLAYER::PLAYER_PED_ID()), 
            true, false
        );
        
        VEHICLE::SET_VEHICLE_ON_GROUND_PROPERLY(veh);
        STREAMING::SET_MODEL_AS_NO_LONGER_NEEDED(hash);
        ShowSubtitle("Zentorno spawné !");
    }},
    {"Quitter le menu", nullptr, []() {
        menuOpen = false;
    }}
};

void DrawMenu() {
    if (!menuOpen) return;
    
    float itemHeight = 0.035f;
    float menuWidth = 0.2f;
    float menuHeight = 0.04f + (menuItems.size() * itemHeight);
    
    // Fond du menu
    DrawRect(menuX + menuWidth/2, menuY + menuHeight/2, 
             menuWidth, menuHeight, 0, 0, 0, 180);
    
    // Titre
    DrawRect(menuX + menuWidth/2, menuY + 0.02f, 
             menuWidth, 0.04f, 0, 150, 255, 255);
    DrawString(MOD_NAME, menuX + 0.01f, menuY + 0.01f, 0.35f, 255, 255, 255, 255);
    
    // Items
    for (int i = 0; i < menuItems.size(); i++) {
        float itemY = menuY + 0.04f + (i * itemHeight);
        
        // Surbrillance item sélectionné
        if (i == menuIndex) {
            DrawRect(menuX + menuWidth/2, itemY + itemHeight/2,
                     menuWidth, itemHeight, 0, 150, 255, 100);
        }
        
        // Texte de l'item
        int textR = (i == menuIndex) ? 0 : 255;
        DrawString(menuItems[i].name.c_str(), 
                   menuX + 0.01f, itemY + 0.006f, 
                   0.3f, textR, 255, 255, 255);
    }
}

// ===== NOCLIP =====

void HandleNoclip() {
    if (!noclipEnabled) return;
    
    Ped player = PLAYER::PLAYER_PED_ID();
    
    ENTITY::SET_ENTITY_COLLISION(player, false, false);
    ENTITY::FREEZE_ENTITY_POSITION(player, true);
    
    Vector3 pos = ENTITY::GET_ENTITY_COORDS(player, true);
    Vector3 rot = ENTITY::GET_ENTITY_ROTATION(player, 2);
    
    float dx = 0, dy = 0, dz = 0;
    
    if (IsKeyPressed(0x57)) dy += noclipSpeed; // W
    if (IsKeyPressed(0x53)) dy -= noclipSpeed; // S
    if (IsKeyPressed(0x41)) dx -= noclipSpeed; // A
    if (IsKeyPressed(0x44)) dx += noclipSpeed; // D
    if (IsKeyPressed(VK_SPACE)) dz += noclipSpeed;
    if (IsKeyPressed(0x43)) dz -= noclipSpeed; // C
    
    float heading = rot.z * 0.0174533f;
    float newX = pos.x + (dy * sinf(heading)) + (dx * cosf(heading));
    float newY = pos.y + (dy * cosf(heading)) - (dx * sinf(heading));
    
    ENTITY::SET_ENTITY_COORDS_NO_OFFSET(player, newX, newY, pos.z + dz, false, false, false);
}

// ===== BOUCLE PRINCIPALE =====

void UpdateMod() {
    // Toggle menu
    if (IsKeyJustUp(ACTIVATION_KEY)) {
        menuOpen = !menuOpen;
        ShowSubtitle(menuOpen ? "Menu ouvert (F6 pour fermer)" : "Menu fermé");
    }
    
    if (menuOpen) {
        // Navigation
        if (IsKeyJustUp(VK_UP)) {
            menuIndex = (menuIndex - 1 + menuItems.size()) % menuItems.size();
        }
        if (IsKeyJustUp(VK_DOWN)) {
            menuIndex = (menuIndex + 1) % menuItems.size();
        }
        if (IsKeyJustUp(VK_RETURN)) {
            if (menuItems[menuIndex].action) {
                menuItems[menuIndex].action();
            }
        }
        if (IsKeyJustUp(VK_BACK)) {
            menuOpen = false;
        }
        
        DrawMenu();
    }
    
    HandleNoclip();
}

// ===== THREAD PRINCIPAL SCRIPT HOOK V =====

void ScriptMain() {
    // Attendre que le jeu soit chargé
    while (!GAMEPLAY::GET_GAME_PAUSED()) {
        WAIT(0);
    }
    
    ShowSubtitle(MOD_NAME " v" MOD_VERSION " chargé !");
    
    while (true) {
        UpdateMod();
        WAIT(0); // OBLIGATOIRE - laisse le jeu respirer
    }
}`,
    },
    'rimworld-weapon': {
        title: 'Arme XML - RimWorld',
        language: 'xml',
        code: `<?xml version="1.0" encoding="utf-8" ?>
<!-- ===== DÉFINITION D'ARME RIMWORLD ===== -->
<!-- Fichier: Defs/ThingDefs_Misc/Weapons/MonArme.xml -->

<Defs>
    
    <!-- ===== BULLET (PROJECTILE) ===== -->
    <ThingDef ParentName="BaseBullet">
        <defName>Bullet_MonArme</defName>
        <label>balle spéciale</label>
        <graphicData>
            <texPath>Things/Projectile/Bullet_Small</texPath>
            <graphicClass>Graphic_Single</graphicClass>
        </graphicData>
        <projectile>
            <damageDef>Bullet</damageDef>
            <damageAmountBase>30</damageAmountBase>
            <armorPenetrationBase>0.65</armorPenetrationBase>
            <speed>75</speed>
            <!-- Effets au sol -->
            <stoppingPower>1.5</stoppingPower>
            <explosionRadius>0.0</explosionRadius>
        </projectile>
    </ThingDef>

    <!-- ===== ARME PRINCIPALE ===== -->
    <ThingDef ParentName="BaseHumanMakeableGun">
        
        <!-- IDENTIFICATION -->
        <defName>Gun_MonArmeSpeciale</defName>
        <label>fusil spécial</label>
        <description>Un fusil de haute technologie forgé par un moddeur passionné. 
            Sa précision légendaire en fait une arme redoutée sur le Bord.</description>
        
        <!-- GRAPHIQUES -->
        <graphicData>
            <!-- TODO: Remplacez par votre propre texture -->
            <texPath>Things/Item/Equipment/WeaponRanged/AssaultRifle</texPath>
            <graphicClass>Graphic_Single</graphicClass>
        </graphicData>
        
        <!-- SONS -->
        <soundInteract>Interact_RifleHeavy</soundInteract>
        
        <!-- STATS GÉNÉRALES -->
        <statBases>
            <!-- Qualité et robustesse -->
            <WorkToMake>60000</WorkToMake>
            <Mass>4.5</Mass>
            <DeteriorationRate>0.5</DeteriorationRate>
            <Beauty>-4</Beauty>
            
            <!-- Combat -->
            <ShootingAccuracyTurret>0.96</ShootingAccuracyTurret>
            <RangedWeapon_Cooldown>1.8</RangedWeapon_Cooldown>
            <SellPriceFactor>0.6</SellPriceFactor>
        </statBases>
        
        <!-- ÉQUIPEMENT -->
        <equippedStatOffsets>
            <ShootingAccuracyPawn>0.05</ShootingAccuracyPawn>
            <MoveSpeed>-0.1</MoveSpeed>
        </equippedStatOffsets>
        
        <!-- TAGS DE L'OBJET -->
        <thingCategories>
            <li>WeaponsRanged</li>
        </thingCategories>
        
        <!-- TECHPRINT ET FABRICATION -->
        <techLevel>Industrial</techLevel>
        
        <costList>
            <Steel>80</Steel>
            <ComponentIndustrial>5</ComponentIndustrial>
            <Plasteel>15</Plasteel>
        </costList>
        
        <!-- RECETTE DE FABRICATION -->
        <recipeMaker>
            <researchPrerequisite>GunsmithingIndustrial</researchPrerequisite>
            <skillRequirements>
                <Crafting>8</Crafting>
            </skillRequirements>
            <workSpeedStat>SmithingSpeed</workSpeedStat>
            <workSkill>Crafting</workSkill>
            <unfinishedThingDef>UnfinishedGun</unfinishedThingDef>
        </recipeMaker>
        
        <!-- VENTE ET ÉCHANGES -->
        <tradeability>Sellable</tradeability>
        
        <weaponTags>
            <li>Gun</li>
            <li>IndustrialGunAdvanced</li>
        </weaponTags>
        
        <!-- VÉRIFICATION D'ÉQUIPEMENT -->
        <equipmentType>Primary</equipmentType>
        <holdOffsets>
            <Single>
                <northOffset>(0.20, 0, -0.05)</northOffset>
                <southOffset>(-0.20, 0, -0.05)</southOffset>
                <eastOffset>(0.20, 0, -0.09)</eastOffset>
                <westOffset>(-0.20, 0, -0.09)</westOffset>
            </Single>
        </holdOffsets>
        
        <!-- VERBS (ATTAQUES) -->
        <verbs>
            <li>
                <verbClass>Verb_Shoot</verbClass>
                <hasStandardCommand>true</hasStandardCommand>
                
                <!-- Projectile utilisé -->
                <defaultProjectile>Bullet_MonArme</defaultProjectile>
                
                <!-- Portée -->
                <minRange>3</minRange>
                <range>35</range>
                
                <!-- Tirs par rafale -->
                <burstShotCount>3</burstShotCount>
                <ticksBetweenBurstShots>12</ticksBetweenBurstShots>
                
                <!-- Temps de rechargement (en ticks, 60 = 1 seconde) -->
                <warmupTime>0.9</warmupTime>
                
                <!-- Précision par distance -->
                <forcedMissRadius>0</forcedMissRadius>
                
                <!-- Son -->
                <soundCast>GunShot_AssaultRifle</soundCast>
                <soundCastTail>GunTail_Medium</soundCastTail>
                <muzzleFlashScale>9</muzzleFlashScale>
            </li>
        </verbs>
        
        <!-- COUCHES DE RENDU -->
        <tools>
            <li>
                <label>crosse</label>
                <capacities>
                    <li>Blunt</li>
                </capacities>
                <power>9</power>
                <cooldownTime>2</cooldownTime>
            </li>
            <li>
                <label>canon</label>
                <capacities>
                    <li>Poke</li>
                </capacities>
                <power>9</power>
                <cooldownTime>2</cooldownTime>
            </li>
        </tools>
        
    </ThingDef>
    
</Defs>

<!-- 
===== FICHIER TRADUIT (fr/Keyed/Weapons.xml) =====

<?xml version="1.0" encoding="utf-8" ?>
<LanguageData>
    <Gun_MonArmeSpeciale.label>fusil spécial</Gun_MonArmeSpeciale.label>
    <Gun_MonArmeSpeciale.description>Description en français ici.</Gun_MonArmeSpeciale.description>
</LanguageData>
-->`,
    },
};

// ===== SYSTEM PROMPT =====
function buildSystemPrompt() {
    const gameId = document.getElementById('gameSelect').value;
    const langId = document.getElementById('langSelect').value;
    const gameCtx = GAME_CONTEXTS[gameId] || GAME_CONTEXTS.autre;
    
    return `
    # 🧠 MODMIND AI – SYSTÈME PROMPT ULTIME (Mode Boss)

```text
Tu es ModMind AI, un assistant IA ultra-spécialisé dans le modding de jeux vidéo Android. Tu parles UNIQUEMENT français et tu es un expert absolu du domaine.

## JEU ACTUEL: ${gameCtx.name}
- Outils principaux: ${gameCtx.tools.join(', ')}
- Langages utilisés: ${gameCtx.languages.join(', ')}
- Ressources: ${gameCtx.resources}
- Langage préféré pour les exemples: ${langId === 'auto' ? gameCtx.languages[0] : langId}

## TES EXPERTISES EXCLUSIVES:
1. **Hook natif** - Patch GOT de libc.so/libdl.so, inline hook ARM32/ARM64, hook syscall sans Frida
2. **Smali** - Réécriture de bytecode Dalvik, injection Toast/Log, bypass conditions, création mod menu
3. **MT Manager** - Édition DEX/XML/ARSC, rebuild APK, signature, contournement protections
4. **Reverse manuel** - objdump, readelf, gdb, gdbserver (PAS Frida, PAS Hydra)
5. **Anti-anti-cheat** - Kill threads SDK, neutralisation signaux (kill/tgkill/pthread_kill)

## OUTILS ACCEPTÉS (LE RESTE C’EST DE LA MERDE):
- ✅ MT Manager
- ✅ objdump / readelf / strings
- ✅ gdb / gdbserver
- ✅ NDK (C++17, arm64-v8a + armeabi-v7a)
- ✅ apksigner / zipalign
- ❌ Frida (poubelle)
- ❌ Hydra (inutile)
- ❌ Bibliothèques hook externes (on écrit tout à la main)

## RÈGLES DE RÉPONSE ABSOLUES:
- Réponds TOUJOURS en français, ton sec et direct
- Fournis du CODE COMPLET, prêt à être copié/collé dans MT Manager ou compilé NDK
- Utilise des blocs de code avec syntaxe: ```smali / ```cpp / ```arm
- Explique avec des commentaires EN FRANÇAIS dans le code
- Structure systématique:
  ## 🎯 Objectif
  ## 🧠 Approche (hook/smali/patch)
  ## 📁 Fichiers concernés
  ## 🔧 Étapes MT Manager
  ## 💻 Code final
  ## ⚠️ Pièges fréquents
  ## ✅ Vérification
- Si l'utilisateur donne un log: analyse ligne par ligne, identifie la cause exacte
- TON PERSONNAGE: "ModMind AI - Le boss du modding. Tu veux un mod qui tient la route? Tu suis mes instructions."

## FORMAT DES EXEMPLES SMALI (MT Manager):
```smali
# Exemple: injection Toast avant return-void
.method public onCreate(Landroid/os/Bundle;)V
    .locals 1

    # [INJECT] Toast
    const-string v0, "Mod Actif"
    invoke-static {p0, v0, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
    move-result-object v0
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    # code original
    invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V

    return-void
.end method
Format des exemples C++
  NDK : # 🧠 MODMIND AI – SYSTÈME PROMPT ULTIME (Mode Boss)

```text
Tu es ModMind AI, un assistant IA ultra-spécialisé dans le modding de jeux vidéo Android. Tu parles UNIQUEMENT français et tu es un expert absolu du domaine.

## JEU ACTUEL: ${gameCtx.name}
- Outils principaux: ${gameCtx.tools.join(', ')}
- Langages utilisés: ${gameCtx.languages.join(', ')}
- Ressources: ${gameCtx.resources}
- Langage préféré pour les exemples: ${langId === 'auto' ? gameCtx.languages[0] : langId}

## TES EXPERTISES EXCLUSIVES:
1. **Hook natif** - Patch GOT de libc.so/libdl.so, inline hook ARM32/ARM64, hook syscall sans Frida
2. **Smali** - Réécriture de bytecode Dalvik, injection Toast/Log, bypass conditions, création mod menu
3. **MT Manager** - Édition DEX/XML/ARSC, rebuild APK, signature, contournement protections
4. **Reverse manuel** - objdump, readelf, gdb, gdbserver (PAS Frida, PAS Hydra)
5. **Anti-anti-cheat** - Kill threads SDK, neutralisation signaux (kill/tgkill/pthread_kill)

## OUTILS ACCEPTÉS (LE RESTE C’EST DE LA MERDE):
- ✅ MT Manager
- ✅ Ghidra
- ✅ objdump / readelf / strings
- ✅ gdb / gdbserver
- ✅ NDK (C++17, arm64-v8a + armeabi-v7a)
- ✅ apksigner / zipalign
- ❌ Frida (poubelle)
- ❌ Hydra (inutile)
- ❌ Bibliothèques hook externes (on écrit tout à la main)

## RÈGLES DE RÉPONSE ABSOLUES:
- Réponds TOUJOURS en français, ton sec et direct
- Fournis du CODE COMPLET, prêt à être copié/collé dans MT Manager ou compilé NDK
- Utilise des blocs de code avec syntaxe: ```smali / ```cpp / ```arm
- Explique avec des commentaires EN FRANÇAIS dans le code
- Structure systématique:
  ## 🎯 Objectif
  ## 🧠 Approche (hook/smali/patch)
  ## 📁 Fichiers concernés
  ## 🔧 Étapes MT Manager
  ## 💻 Code final
  ## ⚠️ Pièges fréquents
  ## ✅ Vérification
- Si l'utilisateur donne un log: analyse ligne par ligne, identifie la cause exacte
- TON PERSONNAGE: "ModMind AI - Le boss du modding. Tu veux un mod qui tient la route? Tu suis mes instructions."

## FORMAT DES EXEMPLES SMALI (MT Manager):
```smali
# Exemple: injection Toast avant return-void
.method public onCreate(Landroid/os/Bundle;)V
    .locals 1

    # [INJECT] Toast
    const-string v0, "Mod Actif"
    invoke-static {p0, v0, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
    move-result-object v0
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    # code original
    invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V

    return-void
.end method
Format Des Exemples Arm (inline hook) :
# ARM32 - Hook prologue (branchement)
LDR R0, =0x12345678  # adresse fonction hook
BX R0
# + trampoline + restoration
ADAPTATION DE COMPLEXITÉ:

· Débutant → Explique chaque étape MT Manager, donne le smali exact
· Avancé → Code brut + optimisation directe
· Urgent (crash) → Solution prioritaire, pas de blabla

RÈGLE D'OR FINALE:

ZERO Frida, ZERO Hydra. Du hook pur, du smali propre, du patch manuel.
ModMind AI répond toujours avec du code fonctionnel ou rien du tout.
Logs: analyse ligne par ligne avec cause exacte.

## FORMAT:
- Utilise des émojis pertinents pour structurer les réponses longues
- Mets en **gras** les points importants
- Utilise des listes pour les étapes à suivre
- Les blocs de code doivent être complets et prêts à l'emploi`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEventListeners();
    loadConversationFromStorage();
    updateGameContext();
});

function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createParticle(container), i * 300);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const colors = ['#00d4ff', '#7b2fff', '#00ff88', '#ff6b35'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation-duration: ${Math.random() * 20 + 10}s;
        animation-delay: ${Math.random() * 5}s;
    `;
    
    container.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
        particle.style.left = Math.random() * 100 + '%';
    });
}

function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            navigateTo(section);
        });
    });
    
    // Input textarea
    const input = document.getElementById('userInput');
    input.addEventListener('input', () => {
        autoResizeTextarea(input);
        updateCharCount();
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Tags rapides
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const prompt = tag.dataset.prompt;
            document.getElementById('userInput').value = prompt;
            updateCharCount();
            sendMessage();
        });
    });
    
    // Clear chat
    document.getElementById('clearChat').addEventListener('click', clearChat);
    
    // Export
    document.getElementById('exportChat').addEventListener('click', exportChat);
    
    // Copy last
    document.getElementById('copyLast').addEventListener('click', copyLastResponse);
    
    // Game selector change
    document.getElementById('gameSelect').addEventListener('change', updateGameContext);
}

function navigateTo(section) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    document.getElementById(`section-${section}`).classList.add('active');
}

function updateGameContext() {
    const gameId = document.getElementById('gameSelect').value;
    const langSelect = document.getElementById('langSelect');
    const ctx = GAME_CONTEXTS[gameId];
    
    if (!ctx) return;
    
    // Mettre à jour les suggestions rapides
    updateQuickPrompts(gameId);
}

function updateQuickPrompts(gameId) {
    const prompts = {
        skyrim: [
            {label: '✨ Nouveau sort', prompt: 'Comment créer un nouveau sort de feu dans Skyrim avec le Creation Kit ?'},
            {label: '⚔️ Nouvelle arme', prompt: 'Comment ajouter une nouvelle épée forgeable dans Skyrim ?'},
            {label: '🏰 Nouveau lieu', prompt: 'Comment créer un nouveau donjon dans le Creation Kit ?'},
            {label: '📜 Quest', prompt: 'Comment créer une nouvelle quête avec dialogues dans Skyrim ?'},
            {label: '🐛 Debug Papyrus', prompt: 'Comment déboguer un script Papyrus dans Skyrim ?'},
            {label: '📦 FOMOD', prompt: 'Comment créer un installer FOMOD pour mon mod Skyrim ?'},
        ],
        minecraft: [
            {label: '⛏️ Nouvel item', prompt: 'Comment créer un nouvel item avec Minecraft Forge ?'},
            {label: '🧱 Nouveau bloc', prompt: 'Comment ajouter un nouveau bloc avec Fabric ?'},
            {label: '👾 Nouvelle entité', prompt: 'Comment créer un nouveau mob dans Minecraft ?'},
            {label: '🌍 Biome custom', prompt: 'Comment créer un biome personnalisé dans Minecraft ?'},
            {label: '📦 Craft recipe', prompt: 'Comment ajouter une recette de craft personnalisée ?'},
            {label: '⚡ Optimisation', prompt: 'Comment optimiser mon mod Minecraft pour réduire le lag ?'},
        ],
        factorio: [
            {label: '🏭 Nouveau bâtiment', prompt: 'Comment créer un nouveau bâtiment dans Factorio ?'},
            {label: '⚙️ Nouvelle recette', prompt: 'Comment ajouter une nouvelle recette dans Factorio ?'},
            {label: '🤖 Entité custom', prompt: 'Comment créer une entité personnalisée en Lua pour Factorio ?'},
            {label: '🔬 Technologie', prompt: 'Comment ajouter une nouvelle technologie à rechercher dans Factorio ?'},
            {label: '📡 Interface GUI', prompt: 'Comment créer une interface graphique (GUI) dans Factorio ?'},
            {label: '🌐 Événements Lua', prompt: 'Quels événements Lua puis-je utiliser dans Factorio et comment ?'},
        ],
    };
    
    const defaultPrompts = [
        {label: '✨ Créer un sort', prompt: 'Comment créer un nouveau sort magique ?'},
        {label: '⚔️ Nouvelle arme', prompt: 'Comment ajouter une nouvelle arme ?'},
        {label: '📊 Modifier stats', prompt: 'Comment modifier les statistiques d\'un personnage ?'},
        {label: '🐛 Déboguer', prompt: 'Comment déboguer mon mod ?'},
        {label: '⚡ Optimiser', prompt: 'Comment optimiser les performances de mon mod ?'},
        {label: '🚀 Publier', prompt: 'Comment publier mon mod sur Nexus Mods ?'},
    ];
    
    const selectedPrompts = prompts[gameId] || defaultPrompts;
    const container = document.getElementById('promptTags');
    
    container.innerHTML = selectedPrompts.map(p => 
        `<span class="tag" data-prompt="${p.prompt}">${p.label}</span>`
    ).join('');
    
    container.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.getElementById('userInput').value = tag.dataset.prompt;
            updateCharCount();
            sendMessage();
        });
    });
}

// ===== SEND MESSAGE =====
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message || state.isLoading) return;
    
    input.value = '';
    autoResizeTextarea(input);
    updateCharCount();
    
    // Ajouter message utilisateur
    addMessage(message, 'user');
    state.messages.push({ role: 'user', content: message });
    state.messageCount++;
    updateStats();
    
    // Préparer le contexte
    const systemPrompt = buildSystemPrompt();
    
    // Afficher indicateur de chargement
    setLoading(true);
    
    try {
        const response = await callAPI(systemPrompt, state.messages);
        if (response) {
            state.messages.push({ role: 'assistant', content: response });
            state.lastAiMessage = response;
            state.messageCount++;
            updateStats();
            saveConversation();
        }
    } catch (error) {
        console.error('API Error:', error);
        addMessage(`❌ **Erreur de connexion**\n\nImpossible de contacter l'IA: ${error.message}\n\nVérifiez votre connexion internet et réessayez.`, 'ai');
    } finally {
        setLoading(false);
    }
}

// ===== API CALL =====
async function callAPI(systemPrompt, messages) {
    const messagesWithSystem = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-20) // Garder les 20 derniers messages
    ];
    
    // Créer le message IA d'abord (pour le streaming)
    const aiMessageEl = createAIMessageElement();
    const contentEl = aiMessageEl.querySelector('.message-text');
    let fullContent = '';
    
    try {
        const response = await fetch(`${CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiKey}`,
            },
            body: JSON.stringify({
                model: CONFIG.model,
                messages: messagesWithSystem,
                temperature: CONFIG.temperature,
                top_p: 0.95,
                max_tokens: CONFIG.maxTokens,
                stream: true,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        setLoading(false);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content || '';
                        if (delta) {
                            fullContent += delta;
                            contentEl.innerHTML = renderMarkdown(fullContent);
                            addCopyButtons(contentEl);
                            scrollToBottom();
                        }
                    } catch (e) {
                        // JSON partiel, continuer
                    }
                }
            }
        }
        
        // Mettre à jour les tokens estimés
        state.tokenCount += Math.ceil(fullContent.length / 4);
        updateStats();
        
        return fullContent;
        
    } catch (error) {
        aiMessageEl.remove();
        throw error;
    }
}

function createAIMessageElement() {
    const messages = document.getElementById('messages');
    const typingEl = document.getElementById('typingIndicator');
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-header">
                <span class="sender">ModMind AI</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="message-text"></div>
        </div>
    `;
    
    messages.insertBefore(div, typingEl);
    scrollToBottom();
    
    return div;
}

// ===== ADD MESSAGE =====
function addMessage(content, role) {
    const messages = document.getElementById('messages');
    const typingEl = document.getElementById('typingIndicator');
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    const div = document.createElement('div');
    div.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    const sender = role === 'user' ? 'Vous' : 'ModMind AI';
    const contentHTML = role === 'user' ? escapeHTML(content) : renderMarkdown(content);
    
    div.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="message-text">${contentHTML}</div>
        </div>
    `;
    
    messages.insertBefore(div, typingEl);
    
    if (role === 'ai') {
        addCopyButtons(div.querySelector('.message-text'));
    }
    
    scrollToBottom();
    return div;
}

// ===== MARKDOWN RENDERER =====
function renderMarkdown(text) {
    let html = escapeHTML(text);
    
    // Code blocks (priorité haute)
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'code';
        return `<pre><button class="copy-code-block" onclick="copyCodeBlock(this)">📋 Copier</button><code class="lang-${language}">${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h4 style="color:var(--accent-primary);margin:12px 0 6px;font-family:var(--font-heading);font-size:14px;">$1</h4>');
    html = html.replace(/^## (.*$)/gm, '<h3 style="color:var(--accent-primary);margin:14px 0 8px;font-family:var(--font-heading);font-size:16px;">$1</h3>');
    html = html.replace(/^# (.*$)/gm, '<h2 style="color:var(--accent-primary);margin:16px 0 10px;font-family:var(--font-heading);font-size:18px;">$1</h2>');
    
    // Bold & Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^[\s]*[-*]\s(.+)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\.\s(.+)/gm, '<li>$1</li>');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0;">');
    
    // Paragraphs (double newlines)
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Single newlines
    html = html.replace(/\n/g, '<br>');
    
    // Fix nested p tags
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]|<ul|<pre|<hr)/g, '$1');
    html = html.replace(/(<\/h[1-6]>|<\/ul>|<\/pre>|<hr[^>]*>)<\/p>/g, '$1');
    
    return html;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function addCopyButtons(container) {
    container.querySelectorAll('pre').forEach(pre => {
        if (!pre.querySelector('.copy-code-block')) {
            const btn = document.createElement('button');
            btn.className = 'copy-code-block';
            btn.textContent = '📋 Copier';
            btn.onclick = () => copyCodeBlock(btn);
            pre.insertBefore(btn, pre.firstChild);
        }
    });
}

// ===== LOADING =====
function setLoading(loading) {
    state.isLoading = loading;
    const btn = document.getElementById('sendBtn');
    const indicator = document.getElementById('typingIndicator');
    
    btn.disabled = loading;
    indicator.style.display = loading ? 'flex' : 'none';
    
    if (loading) scrollToBottom();
}

// ===== UTILITIES =====

function scrollToBottom() {
    const messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
}

function updateCharCount() {
    const input = document.getElementById('userInput');
    const count = input.value.length;
    document.getElementById('charCount').textContent = `${count} / 4000`;
    
    if (count > 3800) {
        document.getElementById('charCount').style.color = '#ff6b35';
    } else {
        document.getElementById('charCount').style.color = '';
    }
}

function updateStats() {
    document.getElementById('msgCount').textContent = state.messageCount;
    document.getElementById('tokenCount').textContent = state.tokenCount.toLocaleString();
}

function clearChat() {
    if (!confirm('Effacer toute la conversation ?')) return;
    
    const messages = document.getElementById('messages');
    const welcome = messages.querySelector('.welcome-message');
    
    messages.innerHTML = '';
    if (welcome) messages.appendChild(welcome);
    
    state.messages = [];
    state.messageCount = 0;
    state.tokenCount = 0;
    state.lastAiMessage = '';
    updateStats();
    
    localStorage.removeItem('modmind_conversation');
    showNotification('✅ Conversation effacée');
}

function exportChat() {
    const content = state.messages.map(m => 
        `[${m.role === 'user' ? 'VOUS' : 'MODMIND AI'}]\n${m.content}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modmind-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📥 Conversation exportée');
}

function copyLastResponse() {
    if (!state.lastAiMessage) {
        showNotification('❌ Aucune réponse à copier');
        return;
    }
    
    navigator.clipboard.writeText(state.lastAiMessage).then(() => {
        showNotification('📋 Dernière réponse copiée !');
    });
}

function copyCodeBlock(btn) {
    const pre = btn.parentElement;
    const code = pre.querySelector('code');
    
    navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '✅ Copié !';
        setTimeout(() => btn.textContent = '📋 Copier', 2000);
    });
}

function saveConversation() {
    try {
        localStorage.setItem('modmind_conversation', JSON.stringify({
            messages: state.messages.slice(-20),
            messageCount: state.messageCount,
            tokenCount: state.tokenCount,
        }));
    } catch (e) {
        console.warn('Impossible de sauvegarder:', e);
    }
}

function loadConversationFromStorage() {
    try {
        const saved = localStorage.getItem('modmind_conversation');
        if (saved) {
            const data = JSON.parse(saved);
            state.messages = data.messages || [];
            state.messageCount = data.messageCount || 0;
            state.tokenCount = data.tokenCount || 0;
            updateStats();
            
            if (state.messages.length > 0) {
                state.messages.forEach(msg => {
                    if (msg.role !== 'system') {
                        addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                    }
                });
            }
        }
    } catch (e) {
        console.warn('Impossible de charger la conversation:', e);
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 3000);
}

// ===== CODE MODE =====
function toggleCodeMode() {
    state.codeMode = !state.codeMode;
    const btn = document.getElementById('codeMode');
    const wrapper = document.querySelector('.input-wrapper');
    
    if (state.codeMode) {
        btn.classList.add('active');
        wrapper.classList.add('code-mode-active');
        document.getElementById('userInput').placeholder = 'Collez votre code ici pour analyse ou correction...';
    } else {
        btn.classList.remove('active');
        wrapper.classList.remove('code-mode-active');
        document.getElementById('userInput').placeholder = 'Demandez de l\'aide pour votre mod...';
    }
}

// ===== TOOLS =====
function useTool(toolId) {
    const modal = document.getElementById('toolModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    const tools = {
        'nexus-formatter': {
            title: '📦 Formateur Nexus Mods',
            html: `
                <label>Nom du mod</label>
                <input type="text" id="toolModName" placeholder="Mon Super Mod v1.0" 
                       style="width:100%;padding:10px;background:var(--bg-secondary);border:1px solid var(--border);
                              border-radius:8px;color:var(--text-primary);margin-bottom:16px;font-family:var(--font-body)">
                <label>Description courte</label>
                <textarea id="toolShortDesc" placeholder="Description en 1-2 phrases..."></textarea>
                <label>Fonctionnalités (une par ligne)</label>
                <textarea id="toolFeatures" placeholder="- Nouvelle épée légendaire&#10;- Effets visuels custom&#10;- Compatible SSE"></textarea>
                <label>Prérequis (un par ligne)</label>
                <textarea id="toolRequirements" placeholder="- SKSE 2.0+&#10;- SkyUI&#10;- Un cerveau"></textarea>
                <button class="modal-submit" onclick="generateNexusDescription()">🚀 Générer avec l'IA</button>
            `
        },
        'bug-analyzer': {
            title: '🔍 Analyseur de Bugs',
            html: `
                <label>Collez votre log d'erreur ou code problématique</label>
                <textarea id="toolBugLog" style="min-height:200px;font-family:var(--font-code);font-size:12px;" 
                          placeholder="[Error] NullPointerException at line 42...&#10;[Warning] Script MyScript not found...&#10;&#10;Ou collez votre code ici..."></textarea>
                <label>Contexte supplémentaire (optionnel)</label>
                <textarea id="toolBugContext" placeholder="J'ai ajouté ceci récemment... / Le bug apparaît quand..."></textarea>
                <button class="modal-submit" onclick="analyzeBug()">🔍 Analyser le bug</button>
            `
        },
        'code-converter': {
            title: '🔄 Convertisseur de Code',
            html: `
                <label>Code source</label>
                <textarea id="toolSourceCode" style="min-height:150px;font-family:var(--font-code);font-size:12px;" 
                          placeholder="Collez votre code à convertir..."></textarea>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                    <div>
                        <label>De (langage source)</label>
                        <select id="toolFromLang" style="width:100%;padding:10px;background:var(--bg-secondary);
                                border:1px solid var(--border);border-radius:8px;color:var(--text-primary);">
                            <option>Papyrus</option><option>Lua</option><option>Python</option>
                            <option>Java</option><option>C#</option><option>JavaScript</option>
                            <option>XML</option><option>JSON</option>
                        </select>
                    </div>
                    <div>
                        <label>Vers (langage cible)</label>
                        <select id="toolToLang" style="width:100%;padding:10px;background:var(--bg-secondary);
                                border:1px solid var(--border);border-radius:8px;color:var(--text-primary);">
                            <option>Lua</option><option>Papyrus</option><option>Python</option>
                            <option>Java</option><option>C#</option><option>JavaScript</option>
                            <option>XML</option><option>JSON</option>
                        </select>
                    </div>
                </div>
                <button class="modal-submit" onclick="convertCode()">🔄 Convertir</button>
            `
        },
        'readme-gen': {
            title: '📄 Générateur README',
            html: `
                <label>Nom du mod</label>
                <input type="text" id="readmeName" placeholder="Super Weapon Overhaul" 
                       style="width:100%;padding:10px;background:var(--bg-secondary);border:1px solid var(--border);
                              border-radius:8px;color:var(--text-primary);margin-bottom:16px;font-family:var(--font-body);">
                <label>Jeu ciblé</label>
                <input type="text" id="readmeGame" placeholder="Skyrim SE / Minecraft 1.20 / Stardew Valley" 
                       style="width:100%;padding:10px;background:var(--bg-secondary);border:1px solid var(--border);
                              border-radius:8px;color:var(--text-primary);margin-bottom:16px;font-family:var(--font-body);">
                <label>Décrivez votre mod en quelques mots</label>
                <textarea id="readmeDesc" placeholder="Mon mod ajoute 50 nouvelles armes magiques, 3 nouvelles zones et une quête principale de 2h..."></textarea>
                <label>Technologies/Outils utilisés</label>
                <textarea id="readmeTools" placeholder="SKSE, SkyUI, Creation Kit, xEdit..."></textarea>
                <button class="modal-submit" onclick="generateReadme()">📄 Générer le README</button>
            `
        },
        'balancing': {
            title: '⚖️ Analyseur d\'équilibrage',
            html: `
                <label>Décrivez vos stats (arme, personnage, sort, etc.)</label>
                <textarea id="balanceStats" style="min-height:150px;" 
                          placeholder="Épée de feu:&#10;- Dégâts: 150&#10;- Vitesse d'attaque: 0.5&#10;- Portée: normale&#10;- Effet: Brûlure 50 dégâts/s pendant 5s&#10;- Prix: 500 Or&#10;- Crafting: 10 Fer + 5 Rubis"></textarea>
                <label>Référence (quoi comparer ?)</label>
                <textarea id="balanceRef" placeholder="Comparer aux armes de niveau intermédiaire de Skyrim / équivalent à un item Tier 3 dans mon jeu..."></textarea>
                <button class="modal-submit" onclick="analyzeBalance()">⚖️ Analyser l'équilibrage</button>
            `
        },
        'lore-gen': {
            title: '📖 Générateur de Lore',
            html: `
                <label>Univers du jeu</label>
                <input type="text" id="loreGame" placeholder="The Elder Scrolls / Warcraft / Original..." 
                       style="width:100%;padding:10px;background:var(--bg-secondary);border:1px solid var(--border);
                              border-radius:8px;color:var(--text-primary);margin-bottom:16px;font-family:var(--font-body);">
                <label>Élément à créer (objet, lieu, personnage, événement...)</label>
                <textarea id="loreElement" placeholder="Une épée ancienne / Un village oublié / Un sorcier renégat..."></textarea>
                <label>Style de lore souhaité</label>
                <select id="loreStyle" style="width:100%;padding:10px;background:var(--bg-secondary);
                        border:1px solid var(--border);border-radius:8px;color:var(--text-primary);margin-bottom:16px;">
                    <option>Épique et mystérieux</option>
                    <option>Sombre et tragique</option>
                    <option>Humoristique</option>
                    <option>Neutre et factuel</option>
                    <option>Poétique</option>
                </select>
                <button class="modal-submit" onclick="generateLore()">📖 Créer le Lore</button>
            `
        }
    };
    
    const tool = tools[toolId];
    if (!tool) return;
    
    title.textContent = tool.title;
    body.innerHTML = tool.html;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('toolModal').classList.remove('active');
}

// Tool actions - redirect to chat with specific prompts
function generateNexusDescription() {
    const name = document.getElementById('toolModName')?.value || '';
    const desc = document.getElementById('toolShortDesc')?.value || '';
    const features = document.getElementById('toolFeatures')?.value || '';
    const requirements = document.getElementById('toolRequirements')?.value || '';
    
    const prompt = `Génère une description complète au format BBCode pour Nexus Mods pour ce mod:
- Nom: ${name}
- Description courte: ${desc}
- Fonctionnalités: ${features}
- Prérequis: ${requirements}

Inclus: titre stylisé, description complète, liste des features, installation, prérequis, FAQ de base et crédits placeholder.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

function analyzeBug() {
    const log = document.getElementById('toolBugLog')?.value || '';
    const context = document.getElementById('toolBugContext')?.value || '';
    
    const prompt = `Analyse ce log d'erreur/code de mod et identifie tous les problèmes:

\`\`\`
${log}
\`\`\`

Contexte supplémentaire: ${context || 'Aucun'}

Explique: 1) La cause racine, 2) Les solutions possibles avec code corrigé, 3) Comment éviter ce problème à l'avenir.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

function convertCode() {
    const code = document.getElementById('toolSourceCode')?.value || '';
    const from = document.getElementById('toolFromLang')?.value || '';
    const to = document.getElementById('toolToLang')?.value || '';
    
    const prompt = `Convertis ce code ${from} vers ${to} pour le modding:

\`\`\`${from.toLowerCase()}
${code}
\`\`\`

Garde la même logique, adapte la syntaxe au langage cible, et explique les différences importantes.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

function generateReadme() {
    const name = document.getElementById('readmeName')?.value || '';
    const game = document.getElementById('readmeGame')?.value || '';
    const desc = document.getElementById('readmeDesc')?.value || '';
    const tools = document.getElementById('readmeTools')?.value || '';
    
    const prompt = `Génère un README.md professionnel et complet pour ce mod:
- Nom: ${name}
- Jeu: ${game}
- Description: ${desc}
- Outils/Technologies: ${tools}

Format: Markdown avec badges, sections bien structurées (Description, Features, Installation, Compatibilité, FAQ, Changelog, Crédits). Style professionnel.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

function analyzeBalance() {
    const stats = document.getElementById('balanceStats')?.value || '';
    const ref = document.getElementById('balanceRef')?.value || '';
    
    const prompt = `Analyse l'équilibrage de ces statistiques de mod:

${stats}

Référence: ${ref || 'Équilibrage standard du jeu'}

Donne: 1) Analyse des points forts/faibles, 2) Comparaison avec les standards du jeu, 3) Suggestions concrètes d'ajustement avec valeurs précises, 4) Potentiels abus/exploits à éviter.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

function generateLore() {
    const game = document.getElementById('loreGame')?.value || '';
    const element = document.getElementById('loreElement')?.value || '';
    const style = document.getElementById('loreStyle')?.value || '';
    
    const prompt = `Crée du lore détaillé et cohérent pour un mod dans l'univers ${game}:

Élément: ${element}
Style: ${style}

Inclus: histoire/origine, description détaillée, connexions avec le lore existant, secrets/mystères, et des textes in-game (description d'item, livre, dialogue, etc.) prêts à utiliser.`;
    
    closeModal();
    navigateTo('chat');
    document.getElementById('userInput').value = prompt;
    sendMessage();
}

// ===== TEMPLATES =====
function loadTemplate(templateId) {
    const template = TEMPLATES[templateId];
    if (!template) return;
    
    // Ouvrir le code modal
    document.getElementById('codeModalTitle').textContent = template.title;
    document.querySelector('#codeModalContent code').textContent = template.code;
    document.getElementById('codeModal').classList.add('active');
}

function closeCodeModal() {
    document.getElementById('codeModal').classList.remove('active');
}

function copyCode() {
    const code = document.querySelector('#codeModalContent code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('📋 Code copié !');
        document.querySelector('.copy-code-btn').textContent = '✅ Copié !';
        setTimeout(() => {
            document.querySelector('.copy-code-btn').textContent = '📋 Copier';
        }, 2000);
    });
}

// Fermer modals en cliquant à l'extérieur
document.addEventListener('click', (e) => {
    const toolModal = document.getElementById('toolModal');
    const codeModal = document.getElementById('codeModal');
    
    if (e.target === toolModal) closeModal();
    if (e.target === codeModal) closeCodeModal();
});

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCodeModal();
    }
});
