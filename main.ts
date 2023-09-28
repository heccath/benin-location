import express from "express";
import cors from "cors";
import places from './places.json';

const app = express();
app.use(cors());

app.get("/", (_, res) => {
    res.status(200).send("Hello world");
});

app.get("/departments", (_, res) => {
    const departments = places.map((place) => ({
        id: place.id_dep,
        name: place.lib_dep,
        slug: place.slug,
    }));
    res.status(200).json(departments);
});

app.get("/departments/:departmentSlug/communes", (req, res) => {
    const departmentSlug = req.params.departmentSlug;
    const department = places.find((place) => place.slug === departmentSlug);

    if (!department || !department.communes) {
        res.status(404).json({ error: "Département non trouvé ou sans communes." });
        return;
    }

    const communes = department.communes.map((commune) => ({
        id: commune.id_com,
        name: commune.lib_com,
        slug: commune.slug,
    }));

    res.status(200).json(communes);
});

app.get("/communes/:communeSlug/arrondissements", (req, res) => {
    const communeSlug = req.params.communeSlug;
    const department = places.find((place) =>
        place.communes.find((commune) => commune.slug === communeSlug)
    );

    if (!department || !department.communes) {
        res.status(404).json({ error: "Commune non trouvée ou sans arrondissements." });
        return;
    }

    const commune = department.communes.find((commune) => commune.slug === communeSlug);

    if (!commune || !commune.arrondissements) {
        res.status(404).json({ error: "Commune non trouvée ou sans arrondissements." });
        return;
    }

    const arrondissements = commune.arrondissements.map((arrondissement) => ({
        id: arrondissement.id_arrond,
        name: arrondissement.lib_arrond,
        slug: arrondissement.slug,
    }));

    res.status(200).json(arrondissements);
});

app.listen(3002, () => {
    console.log("Le serveur fonctionne sur le port 3002...");
});
