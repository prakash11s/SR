class RBACService {

    isAllowed(abilities:[], abilityName:string) {
        return abilities.some((ability:any) => ability.name === abilityName);
    }
}

export default new RBACService();
